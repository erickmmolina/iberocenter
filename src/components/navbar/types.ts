export interface Contact {
  name: string;
  number: string;
}

export interface Notification {
  id: string;
  type: 'voicemail' | 'voicemail_abandoned';
  contact: Contact;
  timestamp: Date;
}