export interface ResultModalType {
  comment: string;
  isOpen: boolean;
}

export interface AlertModalType {
  isOpen: () => void;
  comment: string;
}
