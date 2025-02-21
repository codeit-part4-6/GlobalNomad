import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {QueryFunctionContext, useMutation, useQueryClient} from '@tanstack/react-query';
import OverlayContainer from '@/components/common/modal/overlay-container';
import InfiniteScroll from '@/components/common/lnfiniteScroll';
import {Notifications} from '@/types/getMynotifications';
import {deleteMynotifications} from '@/service/api/mynotifications/deleteMyNotifications.api';
import {CustomInfiniteData} from '@/service/api/mynotifications/getMynotifications.api';
import getInitialDevice from '@/utils/initial-device';
import CloseIcon from '@/public/icon/ic_close_black.svg';
import NotiBlueIcon from '@/public/icon/ic_noti_blue.svg';
import NotiRedIcon from '@/public/icon/ic_noti_red.svg';
import CloseButton from '@/public/icon/ic_close_button.svg';

interface NotificationProps {
  onClose: () => void;
  className?: string;
  notificationCount: number;
  fetchNotifications: (context: QueryFunctionContext) => Promise<CustomInfiniteData<Notifications[], number>>;
}

type InitialDevice = 'mobile' | 'desktop' | 'tablet';
type StatusType = '승인' | '거절' | '알 수 없음';

export default function Notification({className = 'w-auto', onClose, notificationCount, fetchNotifications}: NotificationProps) {
  const notificationRef = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<InitialDevice>('mobile');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteMynotifications(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
    },
    onError: (error: unknown) => {
      console.error(error);
    },
  });

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        if (onClose) {
          onClose();
        }
      }
    },
    [onClose],
  );
  function getStatus(content: string): StatusType {
    if (/승인/.test(content)) return '승인';
    if (/거절/.test(content)) return '거절';
    return '알 수 없음';
  }

  const timeAgo = (dateString: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000); // 초 단위 차이

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
  };

  const handleClickDelete = (id: number) => {
    mutation.mutate(id);
  };

  useEffect(() => {
    const getDeviceType = getInitialDevice() as InitialDevice;
    setDevice(getDeviceType);
  }, [device]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const renderField = () => {
    return (
      <div className="flex flex-col px-5 py-6">
        <div className="flex items-center justify-between pb-4">
          <div className="text-xl font-bold dark:text-gray-50">알림 {notificationCount}</div>
          <Image className="dark:bg-white" src={CloseIcon} alt="닫기" width={24} height={24} onClick={onClose} />
        </div>
        <InfiniteScroll
          className="h-500pxr w-full tablet:h-280pxr pc:h-398pxr"
          queryKey="notifications"
          fetchData={fetchNotifications}
          render={(group: CustomInfiniteData<Notifications[], unknown>) => {
            const notifications = group.pages.flatMap(page => page);
            if (notificationCount === 0) {
              return <div className="flex h-[280px] items-center justify-center text-xl text-gray-600">모든 알림을 확인하셨어요.</div>;
            } else {
              return (
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    {notifications.map((data: Notifications) => {
                      const status = getStatus(data.content);
                      return (
                        <Fragment key={data.id}>
                          <div className="my-2 w-full bg-white px-3 py-4">
                            <div className="flex items-center justify-between">
                              <Image
                                src={status === '승인' ? NotiBlueIcon : NotiRedIcon}
                                alt={status === '거절' ? '승인 아이콘' : '거절 아이콘'}
                                width={5}
                                height={5}
                              />
                              <div onClick={() => handleClickDelete(data.id)}>
                                <Image src={CloseButton} alt="닫기" width={24} height={24} />
                              </div>
                            </div>
                            <div className="pb-1 text-md font-normal">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: data.content
                                    .replace(/승인/g, '<span class="text-blue-200">승인</span>')
                                    .replace(/거절/g, '<span class="text-red-500">거절</span>'),
                                }}
                              />
                            </div>
                            <div className="text-xs font-normal text-gray-500">{timeAgo(data.createdAt)}</div>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            }
          }}
        ></InfiniteScroll>
      </div>
    );
  };

  return (
    <>
      {device === 'mobile' ? (
        <>
          <OverlayContainer>
            <div
              className="relative h-full w-full cursor-pointer bg-green-50 px-24pxr pb-40pxr pt-24pxr dark:bg-stone-800"
              onClick={e => e.stopPropagation()}
            >
              {renderField()}
            </div>
          </OverlayContainer>
        </>
      ) : (
        <div ref={notificationRef} className={`absolute w-400pxr cursor-pointer rounded-xl bg-green-50 ${className} dark:bg-stone-800`}>
          {/* 렌더영역 */}
          {renderField()}
        </div>
      )}
    </>
  );
}
