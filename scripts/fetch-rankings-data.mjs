#!/usr/bin/env node
// Build-time fetch of CFB rankings data from Cloudflare R2 (S3-compatible API).
//
// The site is fully static (no server adapter, no API routes), so the Rankings
// page's data has to be baked into public/data/cfb/ before `astro build` runs.
// This script does that: it reads the R2 read-only credentials from the
// environment, downloads rankings/index.json plus every season/week snapshot
// it lists, and writes them to local static files Astro can read at build time.
//
// If credentials aren't configured (e.g. local dev without secrets set), this
// script warns and exits 0 -- it must never break `npm run dev` or a build.
// If credentials ARE configured but a fetch fails, it exits non-zero so a
// Cloudflare Pages build fails loudly instead of shipping stale/missing data.

import { mkdir, writeFile } from "node:fs/promises";
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

async function main() {
  const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    console.warn(
      "[fetch-rankings-data] R2 credentials not configured, skipping rankings data fetch -- " +
        "existing public/data/cfb/ contents (if any) will be used."
    );
    return;
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
}

main().catch((error) => {
  console.error("[fetch-rankings-data] Failed to fetch rankings data from R2:", error);
  process.exit(1);
});
