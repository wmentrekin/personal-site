export interface NowSection {
  label: string;
  text: string;
}

export interface NowEntry {
  date: string;
  title?: string;
  intro: string;
  sections: NowSection[];
}
