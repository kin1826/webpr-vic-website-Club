export type ClubDirection = {
  timeframe: string;
  title: string;
  description: string;
};

export type ClubOverviewContent = {
  title: string;
  description: string;
  shortTerm: ClubDirection;
  longTerm: ClubDirection;
  values: string[];
  editorialNote: string;
};
