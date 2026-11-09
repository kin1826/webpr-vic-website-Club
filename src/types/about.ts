export type AboutPrinciple = {
  title: string;
  description: string;
};

export type AboutPageContent = {
  hero: {
    introduction: string;
    primaryLinkLabel: string;
    secondaryLinkLabel: string;
  };
  story: {
    title: string;
    paragraphs: readonly string[];
    principles: readonly AboutPrinciple[];
  };
  directionIntroduction: string;
  departments: {
    title: string;
    introduction: string;
  };
  team: {
    title: string;
    introduction: string;
  };
  invitation: {
    title: string;
    description: string;
    buttonLabel: string;
  };
};
