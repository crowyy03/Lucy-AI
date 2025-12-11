export interface PricingTier {
  name: string;
  minutes: string;
  features: string[];
  recommended?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface UseCase {
  industry: string;
  dialogue: {
    client: string;
    lucy: string;
  };
  image?: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}