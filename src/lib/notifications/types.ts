export interface NotificationContact {
  name?: string;
  number: string;
}

export interface Notification {
  id: string;
  type: 'voicemail' | 'voicemail_abandoned';
  contact: NotificationContact;
  timestamp: Date;
  read: boolean;
}

export interface NotificationDTO {
  id: string;
  type: string;
  contact_name: string | null;
  contact_number: string;
  read: boolean;
  created_at: string;
}

export function mapNotificationFromDTO(dto: NotificationDTO): Notification {
  return {
    id: dto.id,
    type: dto.type as Notification['type'],
    contact: {
      name: dto.contact_name || undefined,
      number: dto.contact_number
    },
    timestamp: new Date(dto.created_at),
    read: dto.read
  };
}