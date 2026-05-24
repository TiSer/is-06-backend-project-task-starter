import type { LapTimeRow } from "@/components/lap-time-table";

export type Track = {
  id: string;
  name: string;
  personalBest: string;
  sessionCount: number;
  layout: string;
};

export type Session = {
  id: string;
  trackId: string;
  title: string;
  lapCount: number;
  averageLap: string;
  date: string;
};

export type GalleryPhoto = {
  id: string;
  title: string;
  track: string;
  date: string;
  src: string;
};

export const tracks: Track[] = [
  {
    id: "dniprokart",
    name: "DniproKart",
    personalBest: "1:04.2",
    sessionCount: 12,
    layout: "Technical kart circuit · 1.2 km",
  },
  {
    id: "autodrom",
    name: "Autodrom",
    personalBest: "1:12.8",
    sessionCount: 8,
    layout: "Fast flowing layout · 2.4 km",
  },
  {
    id: "kiev-ring",
    name: "Kiev Ring",
    personalBest: "2:01.4",
    sessionCount: 5,
    layout: "Full circuit · 4.1 km",
  },
];

export const lapTimes: LapTimeRow[] = [
  { id: "lap-24", session: "#24", track: "DniproKart", bestLap: "1:04.2", date: "May 18" },
  { id: "lap-23", session: "#23", track: "DniproKart", bestLap: "1:05.1", date: "May 12" },
  { id: "lap-22", session: "#22", track: "Autodrom", bestLap: "1:12.8", date: "May 05" },
  { id: "lap-21", session: "#21", track: "Kiev Ring", bestLap: "2:01.4", date: "Apr 28" },
  { id: "lap-20", session: "#20", track: "DniproKart", bestLap: "1:05.8", date: "Apr 20" },
];

export const sessions: Session[] = [
  {
    id: "s24",
    trackId: "dniprokart",
    title: "DniproKart — May 18",
    lapCount: 12,
    averageLap: "1:06.4",
    date: "May 18",
  },
  {
    id: "s23",
    trackId: "dniprokart",
    title: "DniproKart — May 12",
    lapCount: 10,
    averageLap: "1:07.1",
    date: "May 12",
  },
  {
    id: "s22",
    trackId: "autodrom",
    title: "Autodrom — May 05",
    lapCount: 14,
    averageLap: "1:14.2",
    date: "May 05",
  },
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "p1",
    title: "Main straight — Morning session",
    track: "DniproKart",
    date: "May 18",
    src: "/gallery/track-day-01.jpg",
  },
  {
    id: "p2",
    title: "Ninja — Tree line",
    track: "DniproKart",
    date: "May 18",
    src: "/gallery/track-day-02.jpg",
  },
  {
    id: "p3",
    title: "Grid approach — Wildflowers",
    track: "Autodrom",
    date: "May 12",
    src: "/gallery/track-day-03.jpg",
  },
  {
    id: "p4",
    title: "Knee down — Mid corner",
    track: "DniproKart",
    date: "May 18",
    src: "/gallery/track-day-04.jpg",
  },
  {
    id: "p5",
    title: "Pack through Turn 3",
    track: "DniproKart",
    date: "May 18",
    src: "/gallery/track-day-05.jpg",
  },
  {
    id: "p6",
    title: "Rubber marks — Full send",
    track: "Autodrom",
    date: "May 05",
    src: "/gallery/track-day-06.jpg",
  },
];

/** High-quality delivery for next/image (sources are ~682px wide). */
export const galleryImageQuality = 90;

export const heroStats = {
  bestLap: "1:04.2",
  sessions: "24",
  tracks: "5",
};
