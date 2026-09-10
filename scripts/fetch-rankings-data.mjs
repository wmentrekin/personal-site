#!/usr/bin/env node
// Build-time fetch of CFB rankings data from Cloudflare R2 (S3-compatible API).
//
// The site is fully static (no server adapter, no API routes), so the Rankings
// page's data has to be baked into public/data/cfb/ before `astro build` runs.
// This script does that: it reads the R2 read-only credentials from the
// environment, downloads rankings/index.json plus every season/week snapshot
// it lists, and writes them to local static files Astro can read at build time.
//
// It also fetches the Season Grid schedule artifact the same way: schedule/
// index.json plus schedule/{season}/latest.json for every season it lists,
// written to public/data/cfb/schedule/ alongside the rankings data.
//
// Credential handling is deliberately asymmetric, because "no credentials" means
// two very different things:
//
//   - Local dev, with data already in public/data/cfb/ from an earlier fetch:
//     warn and exit 0. Working offline must stay possible.
//   - A build with neither credentials NOR data on disk: exit non-zero. This is
//     the case that used to ship silently. public/data/cfb/ is gitignored, so a
//     Cloudflare Pages build starts empty; without credentials the fetch was
//     skipped, `astro build` happily produced a site whose rankings page renders
//     its empty state, and the deploy went green. A preview URL that looks
//     finished but has no data in it is worse than a build that fails.
//
// If credentials ARE configured but a fetch fails, it exits non-zero too, so a
// build fails loudly instead of shipping stale or partial data.

import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_ENV_VARS = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID_READONLY",
  "R2_SECRET_ACCESS_KEY_READONLY",
  "R2_BUCKET_NAME"
];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputDir = join(scriptDir, "..", "public", "data", "cfb");
const scheduleOutputDir = join(outputDir, "schedule");

async function main() {
  const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    // Is there already data to fall back on? That is what separates a local dev
    // run from a misconfigured CI build -- see the header comment.
    const haveLocalData = await Promise.all(
      [join(outputDir, "index.json"), join(scheduleOutputDir, "index.json")].map((f) =>
        access(f).then(
          () => true,
          () => false
        )
      )
    ).then((results) => results.every(Boolean));

    if (haveLocalData) {
      console.warn(
        "[fetch-rankings-data] R2 credentials not configured; using the existing " +
          "public/data/cfb/ contents. Fine locally -- but this data is whatever was " +
          `fetched last, not necessarily current. Missing: ${missingVars.join(", ")}`
      );
      return;
    }

    console.error(
      "[fetch-rankings-data] R2 credentials not configured AND public/data/cfb/ is empty, " +
        "so this build would produce a site with no rankings and no Season Grid -- and would " +
        "otherwise succeed, which is how an empty preview ships looking finished.\n" +
        `  Missing: ${missingVars.join(", ")}\n` +
        "  On Cloudflare Pages these are set per environment. If production works but a " +
        "branch preview does not, they are configured for Production only and need adding " +
        "to Preview as well."
    );
    process.exit(1);
  }

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID_READONLY;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY_READONLY;
  const bucketName = process.env.R2_BUCKET_NAME;

  const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: "auto",
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });

  async function fetchJson(key) {
    const response = await client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key })
    );
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  }

  async function writeJson(path, data) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(data, null, 2), "utf-8");
  }

  console.log("[fetch-rankings-data] Fetching rankings/index.json from R2...");
  const index = await fetchJson("rankings/index.json");
  await writeJson(join(outputDir, "index.json"), index);

  let weekFileCount = 0;
  for (const { season, weeks } of index.seasons ?? []) {
    for (const week of weeks ?? []) {
      const paddedWeek = String(week).padStart(2, "0");
      const key = `rankings/${season}/week-${paddedWeek}.json`;
      console.log(`[fetch-rankings-data] Fetching ${key}...`);
      const weekData = await fetchJson(key);
      await writeJson(join(outputDir, String(season), `week-${paddedWeek}.json`), weekData);
      weekFileCount += 1;
    }
  }

  console.log(
    `[fetch-rankings-data] Done. Wrote index.json + ${weekFileCount} week file(s) to public/data/cfb/.`
  );

  console.log("[fetch-rankings-data] Fetching schedule/index.json from R2...");
  const scheduleIndex = await fetchJson("schedule/index.json");
  await writeJson(join(scheduleOutputDir, "index.json"), scheduleIndex);

  let scheduleFileCount = 0;
  for (const season of scheduleIndex.seasons ?? []) {
    const key = `schedule/${season}/latest.json`;
    console.log(`[fetch-rankings-data] Fetching ${key}...`);
    const seasonData = await fetchJson(key);
    await writeJson(join(scheduleOutputDir, String(season), "latest.json"), seasonData);
    scheduleFileCount += 1;
  }

  console.log(
    `[fetch-rankings-data] Done. Wrote schedule/index.json + ${scheduleFileCount} season file(s) to public/data/cfb/schedule/.`
  );
}

main().catch((error) => {
  console.error("[fetch-rankings-data] Failed to fetch rankings data from R2:", error);
  process.exit(1);
});
