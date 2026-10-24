export const workCategories = [
  { id: 'visualisation', path: 'visualisation/', en: 'Data Visualization', de: 'Daten\u00ADvisualisierung' },
  { id: 'research', path: 'analytics/', en: 'Research & Experiments', de: 'Forschung & Experimente' },
  { id: 'creativity', path: 'creativity/', en: 'Problem Solving & Creativity', de: 'Problemlösen & Kreativität' },
  { id: 'community', path: 'community/', en: 'Community & Volunteering', de: 'Engagement & Ehrenamt' },
  { id: 'courses', path: 'courses/', en: 'Courses', de: 'Kurse' },
];

export type FavouriteBook = {
  title: string;
  note: string;
  theme: string;
  mark: string;
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
  coverSource?: string;
  coverCredit?: string;
};

export const favouriteBooks: FavouriteBook[] = [
  { title: 'Originals', note: 'Adam Grant', theme: 'ochre', mark: '✳', cover: 'books/originals.webp', coverWidth: 587, coverHeight: 900, coverSource: 'https://m.media-amazon.com/images/I/71RyFzezDGL._SL1500_.jpg', coverCredit: 'Amazon' },
  { title: 'Phantoms in the Brain', note: 'V. S. Ramachandran & Sandra Blakeslee', theme: 'rose', mark: '◉', cover: 'books/phantoms.webp', coverWidth: 258, coverHeight: 386, coverSource: 'https://en.wikipedia.org/wiki/Phantoms_in_the_Brain' },
  { title: 'India After Gandhi', note: 'Ramachandra Guha', theme: 'sage', mark: '❧', cover: 'books/india-after-gandhi.webp', coverWidth: 253, coverHeight: 394, coverSource: 'https://en.wikipedia.org/wiki/India_After_Gandhi' },
  { title: 'Inglorious Empire', note: 'Shashi Tharoor', theme: 'rose', mark: '▣', cover: 'books/inglorious-empire.webp', coverWidth: 250, coverHeight: 371, coverSource: 'https://en.wikipedia.org/wiki/Inglorious_Empire' },
  { title: 'The Last Mughal', note: 'William Dalrymple', theme: 'ochre', mark: '○', cover: 'books/last-mughal.webp', coverWidth: 255, coverHeight: 391, coverSource: 'https://en.wikipedia.org/wiki/The_Last_Mughal' },
  { title: 'Thinking, Fast and Slow', note: 'Daniel Kahneman', theme: 'sage', mark: '◈', cover: 'books/thinking-fast-and-slow.webp', coverWidth: 259, coverHeight: 385, coverSource: 'https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow' },
  { title: 'Nudge', note: 'Richard H. Thaler & Cass R. Sunstein', theme: 'ochre', mark: '✎', cover: 'books/nudge.webp', coverWidth: 255, coverHeight: 391, coverSource: 'https://en.wikipedia.org/wiki/Nudge_(book)' },
  { title: 'Irrational', note: '', theme: 'rose', mark: '∿', cover: 'books/irrational.webp', coverWidth: 600, coverHeight: 574, coverSource: 'https://www.mackbooks.us/cdn/shop/files/Irrational_cover3.jpg?v=1770428387', coverCredit: 'MACK' },
];
