export const tableauProjects = [
  {
    title: 'Snapshot of Delays: Germany’s High Speed Trains',
    category: 'Transport',
    description: 'A Tableau dashboard showing delays on Germany’s high-speed trains.',
    image: 'snapshot-delays.webp',
    view: 'SnapshotofDelaysGermanysHighSpeedTrains/Dashboard1',
  },
  {
    title: 'A Journey Through Delays',
    category: 'Transport',
    description: 'A flower-shaped dashboard presenting train delay data.',
    image: 'journey-delays.webp',
    view: 'AJourneyThroughDelays/Dashboard_Flower',
  },
  {
    title: 'Shades of Trust: How Americans Trust Each Other',
    category: 'Society',
    description: 'A Tableau dashboard exploring interpersonal trust in America.',
    image: 'shades-trust.webp',
    view: 'ShadesofTrustHowAmericansTrustEachOther/DashboardATPTrustEachOther',
  },
];

export type NotebookImage = {
  src: string;
  alt: string;
  altDe: string;
  width: number;
  height: number;
  wide?: boolean;
  scroll?: boolean;
};

export const notebooks: {
  title: string;
  slug: string;
  description: string;
  images: NotebookImage[];
}[] = [
  {
    title: 'Cyclistic analysis · Part 1',
    slug: 'part1cyclistic-google',
    description: 'The first part of my Google Data Analytics capstone on Cyclistic, a fictional Chicago bike-rental company. I compared how annual members and casual riders used the bikes in 2022.',
    images: [{
      src: 'cyclistic-1.webp',
      alt: 'Chart of Cyclistic rides by member and casual riders across the year.',
      altDe: 'Diagramm der Cyclistic-Fahrten von Mitgliedern und Gelegenheitsfahrern über das Jahr.',
      width: 1400,
      height: 778,
    }],
  },
  {
    title: 'Cyclistic analysis · Part 2',
    slug: 'google-da-capstone-part2-cyclistic',
    description: 'Casual riders are mainly summer and weekend riders. Members rent more throughout the year. Casual rentals jump from May, peak in July, and fade after September, while member rentals stay high from March and fade only after October.',
    images: [{
      src: 'cyclistic-2.webp',
      alt: 'Scatter chart of Cyclistic ride counts by start time for members and casual riders, January 2022 to January 2023.',
      altDe: 'Streudiagramm der Cyclistic-Fahrten nach Startzeit für Mitglieder und Gelegenheitsfahrer, Januar 2022 bis Januar 2023.',
      width: 1400,
      height: 778,
    }],
  },
  {
    title: 'Nutrition diary',
    slug: 'diet-diary-tracking-protein-other-macros',
    description: 'A personal food diary covering 324 days. I checked a calorie target of about 1,500 and two protein targets: 65 grams a day, and 30 percent of calories from protein. The 65-gram target was met, at an average of 81 grams a day. The 30 percent target was not met on most days.',
    images: [
      {
        src: 'nutrition-targets.webp',
        alt: 'Scatter chart comparing a daily protein target of 65 grams with 30 percent of calories from protein.',
        altDe: 'Streudiagramm zum Vergleich eines täglichen Proteinziels von 65 Gramm mit 30 Prozent der Kalorien aus Protein.',
        width: 1400,
        height: 663,
      },
      {
        src: 'nutrition-months.webp',
        alt: 'Monthly charts of calories from protein, fat, and carbohydrates, April 2023 to May 2024.',
        altDe: 'Monatsdiagramme zu Kalorien aus Protein, Fett und Kohlenhydraten, April 2023 bis Mai 2024.',
        width: 1600,
        height: 1089,
      },
      {
        src: 'nutrition-guide.webp',
        alt: 'Food decision guide comparing protein and calories per 100 grams of food.',
        altDe: 'Entscheidungshilfe zum Vergleich von Protein und Kalorien je 100 Gramm Lebensmittel.',
        width: 900,
        height: 3626,
        scroll: true,
      },
      {
        src: 'nutrition-timeline.webp',
        alt: 'Chart of calories from protein, fat, and carbohydrates from April 2023 to May 2024.',
        altDe: 'Diagramm zu Kalorien aus Protein, Fett und Kohlenhydraten von April 2023 bis Mai 2024.',
        width: 1600,
        height: 637,
        wide: true,
      },
    ],
  },
];

export const forthcomingReports = [
  { title: 'Akshara Foundation', label: 'LEARNING LEVELS / 2012–2013', description: 'Cleaned, coded, and analysed qualitative and quantitative student learning data for a randomised control trial using Excel; published an official report.' },
  { title: 'Bachpan Bachao Andolan', label: 'CHILD RIGHTS / 2003–2005', description: 'Monitored and reported on core national projects supporting the emancipation of child and bonded labourers, as Program Officer with the Association for Voluntary Action.' },
];
