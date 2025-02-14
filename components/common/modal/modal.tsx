import Button from '@/components/common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';

interface ModalProps {
  message: string;
  onClose: () => void;
  reservationId?: number | null;
}

export default function Modal({message, onClose}: ModalProps) {
  return (
    <OverlayContainer onClose={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className={
          'relative mx-6 flex h-[13.75rem] w-full items-center justify-center rounded-lg bg-white tablet:h-[15.625rem] tablet:w-[33.75rem] pc:h-[15.625rem] pc:w-[33.75rem]'
        }
      >
        <p className="mb-43pxr text-lg font-medium tablet:mb-0 tablet:text-2lg pc:mb-0 pc:text-2lg">{message}</p>
        <div className="absolute bottom-7 tablet:bottom-7 tablet:right-7 pc:bottom-7 pc:right-7">
          <Button onClick={onClose} className="big-button">
            확인
          </Button>
        </div>
      </div>
    </OverlayContainer>
  );
}
