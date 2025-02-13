export interface ResultModalType {
  message: string;
  isOpen: boolean;
}

export interface AlertModalType {
  onClose: () => void;
  comment: string;
}
