export interface Color {
  hex: string;
  name: string;
  usage: string;
}

export interface Typography {
  headerFont: string;
  bodyFont: string;
  reasoning: string;
}

export interface LogoPrompts {
  primary: string;
  secondary: string;
}

export interface BrandStrategy {
  colors: Color[];
  typography: Typography;
  logoPrompts: LogoPrompts;
  brandVoice?: string;
}

export interface BrandIdentity {
  mission: string;
  strategy: BrandStrategy | null;
  primaryLogoUrl: string | null;
  secondaryMarkUrl: string | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}