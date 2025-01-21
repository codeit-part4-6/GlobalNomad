import React from 'react';
import OverlayContainer from '@/components/common/modal/overlay-container';
import DaumPostcodeEmbed from 'react-daum-postcode';

export interface AddressModal {
  onClose: () => void;
  onComplete: (data: {address: string; zonecode: string}) => void;
}

export default function AddressModal({onClose, onComplete}: AddressModal) {
  return (
    <OverlayContainer onClose={onClose}>
      <div className="flex flex-col overflow-y-auto bg-white p-4 tablet:h-[30rem] tablet:w-[30rem]">
        <DaumPostcodeEmbed onComplete={onComplete} />
      </div>
    </OverlayContainer>
  );
}
