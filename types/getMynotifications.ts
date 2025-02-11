export interface getMynotificationsBody {
  cursorId?: number;
  size?: number;
}

export interface getMynotificationsResponse {
  cursorId: number;
  totalCount: number;
  notifications: Notifications[];
}

export type Notifications = {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
