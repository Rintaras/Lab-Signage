export interface Author {
  name: string;
  affiliation: string;
}

export interface ResearchAbstract {
  id: string;
  title: string;
  authors: Author[];
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  keywords: string[];
}