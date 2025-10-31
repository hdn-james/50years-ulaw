export type Highlight = {
  category: string;
  title: string;
  description: string;
  imageSrc: string;
};

export type HighlightImageCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  category?: string;
  index: number;
  totalCards: number;
};
