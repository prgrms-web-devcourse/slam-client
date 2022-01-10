import { Notification } from "@contexts/AuthProvider/types";

export interface NotificationApi {
  getNotifications: (params: {
    size?: number;
    lastId?: number | null;
    isFirst?: boolean;
  }) => Promise<{
    contents: Notification[];
    lastId: number | null;
  }>;

  readAllNotifications: () => Promise<any>;
}