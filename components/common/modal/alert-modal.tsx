'use client';
import React from 'react';
import {AlertModalType} from '@/types/common/alert-modal.types';
import OverlayContainer from '@/components/common/modal/overlay-container';
import Button from '@/components/common/button';
import InitialDevice from '@/utils/initial-device';

const AlertModal = ({isOpen, comment}: AlertModalType) => {
  const getDeviceType = InitialDevice();
  return (
    <OverlayContainer onClose={isOpen}>
      <div className="flex h-220pxr w-327pxr flex-col items-center justify-center rounded-xl bg-white tablet:h-250pxr tablet:w-540pxr pc:h-250pxr pc:w-540pxr">
        <div className="flex h-172pxr w-full items-center justify-center">
          <p className="text-center text-2lg font-medium text-[#333236]">{comment}</p>
        </div>
        {getDeviceType !== 'mobile' ? (
          <div className="relative h-48pxr w-full">
            <Button className="absolute right-28pxr h-48pxr w-120pxr rounded-lg bg-nomad-black" onClick={isOpen}>
              <p className="text-lg font-medium text-white">확인</p>
            </Button>
          </div>
        ) : (
          <Button className="mb-24pxr h-48pxr w-120pxr rounded-lg bg-nomad-black" onClick={isOpen}>
            <p className="text-lg font-medium text-white">확인</p>
          </Button>
        )}
      </div>
    </OverlayContainer>
  );
};

export default AlertModal;
