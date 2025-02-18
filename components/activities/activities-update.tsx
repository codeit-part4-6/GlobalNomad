import React, {useState} from 'react';
import Image from 'next/image';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ResultModalType} from '@/types/common/alert-modal.types';
import Dropbox from '@/components/common/dropbox';
import Modal from '@/components/common/modal/modal';
import deleteReservation from '@/service/api/activities/deleteActivities';
import isAdmin from '@/utils/admin-auth';
import InitialDevice from '@/utils/initial-device';
import IconMeatball from '@/public/icon/ic_meatball.svg';
import {useRouter} from 'next/navigation';

const DropboxItems = [
  {id: 1, label: '수정하기', type: 'modify'},
  {id: 2, label: '삭제하기', type: 'delete'},
];

const ActivitiesUpdate = ({pageID, userId}: {pageID: string; userId: number}) => {
  const adminAuth = isAdmin(userId);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDropboxOpen, setIsDropboxOpen] = useState<boolean>(false);
  const [isPostResultModalOpen, setIsPostResultModalOpen] = useState<ResultModalType>({message: '', isOpen: false});

  const mutation = useMutation({
    mutationFn: async (pageID: string) => {
      await deleteReservation(pageID);
    },
    onSuccess: () => {
      setIsPostResultModalOpen({message: '등록하신 체험 정보를 삭제했습니다.', isOpen: true});
      queryClient.setQueryData(['activitiesInfo', 'activitiesReviews', 'schedules'], null);
    },
    onError: error => {
      setIsPostResultModalOpen({message: error.message, isOpen: true});
    },
  });

  const moveMypage = ({type, movePageID}: {type: string; movePageID?: string}) => {
    const device = InitialDevice();
    const params = new URLSearchParams(`type=${type}`);
    if (device === 'mobile') params.set('modal', 'true');
    if (movePageID) params.set('id', movePageID);

    router.push(`/mypage/treatReservation?${params.toString()}`);
  };

  const handleActivitiesUpdate = (type: string) => {
    setIsDropboxOpen(false);
    if (type === 'delete') {
      mutation.mutate(pageID);
    } else {
      moveMypage({type: 'modify', movePageID: pageID});
    }
  };

  const handleCloseAletModal = () => {
    setIsPostResultModalOpen({message: '', isOpen: false});
    moveMypage({type: 'manage'});
  };

  return (
    adminAuth && (
      <div>
        <Image src={IconMeatball} onClick={() => setIsDropboxOpen(true)} width={40} height={40} alt="자세히보기" priority />
        {isDropboxOpen && (
          <Dropbox
            onClick={handleActivitiesUpdate}
            onClose={() => setIsDropboxOpen(false)}
            className="right-0 top-10 z-10 mb-4 mr-4 h-115pxr w-160pxr"
            items={DropboxItems}
          />
        )}
        {isPostResultModalOpen.isOpen && <Modal message={isPostResultModalOpen.message} onClose={handleCloseAletModal} />}
      </div>
    )
  );
};

export default ActivitiesUpdate;
