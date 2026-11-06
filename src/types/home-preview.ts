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

export type HomeActivityGroup = {
  id: "tech-sharing" | "mini-hackathon" | "creative-studio" | "extracurricular";
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  icon: "presentation" | "code" | "camera" | "compass";
  cover: string;
  coverAlt: string;
  imagePosition: string;
};
