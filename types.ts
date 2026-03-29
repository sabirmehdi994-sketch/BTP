
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  IMAGE_STUDIO = 'IMAGE_STUDIO',
  EMAIL_ASSISTANT = 'EMAIL_ASSISTANT',
  SETTINGS = 'SETTINGS'
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'unread' | 'replied' | 'flagged';
  aiDraft?: string;
}

export interface AIImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
}
