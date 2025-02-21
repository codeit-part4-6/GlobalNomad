'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Dropbox from '@/components/common/dropbox';
import Notification from '@/components/common/notification';
import SelectingMode from '@/components/common/theme-button';
import {useAuthStore} from '@/service/store/authStore';
import {QueryFunctionContext} from '@tanstack/react-query';
import {CustomInfiniteData, getMynotifications} from '@/service/api/mynotifications/getMynotifications.api';
import {Notifications} from '@/types/getMynotifications';
import navlogo from '@/public/img/img_navlogo.svg';
import notification from '@/public/icon/ic_notification.svg';
import defaultProfileImage from '@/public/icon/ic_defaultProfileImage.svg';

export default function Navbar() {
  const {user, setLogout} = useAuthStore();
  const [isDropdown, setIsDropdown] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleLogout = () => {
    setLogout();
    router.push('/');
  };

  const handleDropdownItemClick = (type: string) => {
    if (type === 'mypage') {
      router.push('/mypage');
    } else if (type === 'logout') {
      handleLogout();
    }
    setIsDropdown(false);
  };

  const fetchNotifications = async (context: QueryFunctionContext) => {
    const data = await getMynotifications({...context, meta: {size: 4}});
    setNotificationCount(data.meta?.totalCount || 0);
    return data as CustomInfiniteData<Notifications[], number>;
  };
  const dropdownItems = [
    {id: 1, label: '마이페이지', type: 'mypage'},
    {id: 2, label: '로그아웃', type: 'logout'},
  ];

  useEffect(() => {
    if (user) {
      fetchNotifications({
        queryKey: ['notifications'],
        signal: new AbortController().signal,
        meta: undefined,
      });
    }
  }, [user]);

  return (
    <>
      <header className="border:bg-gray-100 sticky top-0 z-[50] border-b-[1px] bg-white dark:border-none dark:bg-[#4a504a]">
        <nav className="sticky mx-auto flex h-[4.375rem] max-w-[1200px] px-[1.25rem] py-[1.25rem] md:gap-[1.3125rem] md:px-[0.625rem] md:py-[0.625rem]">
          <div className="flex w-full items-center justify-between">
            <div>
              <Link href="/">
                <Image src={navlogo} alt="로고 아이콘" />
              </Link>
            </div>
            <div className={`relative flex items-center justify-center ${user ? 'gap-12pxr' : 'gap-25pxr'} text-md font-medium text-black-100`}>
              {user ? (
                <>
                  <div className="relative flex cursor-pointer pr-2">
                    <Image src={notification} alt="알림 아이콘" onClick={() => setIsOpenNotification(true)} />
                    {notificationCount > 0 && (
                      <div className="absolute bottom-3 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {notificationCount}
                      </div>
                    )}
                  </div>

                  <hr className="border:bg-gray-100 h-[22px] w-0 border-[1px]" />
                  <div className="relative flex items-center justify-center gap-10pxr">
                    <div onClick={toggleDropdown} className="flex cursor-pointer items-center gap-2">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image src={user.profileImageUrl || defaultProfileImage} alt="프로필 이미지" layout="fill" style={{objectFit: 'cover'}} />
                      </div>
                      <div className="dark:text-white">{user.nickname}</div>
                    </div>
                    {isDropdown && (
                      <Dropbox
                        className="absolute right-0 top-[100%] mt-2 w-[150px] rounded-lg border border-gray-300 bg-white shadow-md"
                        items={dropdownItems}
                        onClick={handleDropdownItemClick}
                        onClose={() => setIsDropdown(false)}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="decoration-2 underline-offset-4 transition duration-200 hover:text-primary hover:underline dark:text-primary">
                    <Link href="/signin">로그인</Link>
                  </div>
                  <div className="decoration-2 underline-offset-4 transition duration-200 hover:text-primary hover:underline dark:text-primary">
                    <Link href="/signup">회원가입</Link>
                  </div>
                </>
              )}
              {isOpenNotification && (
                <Notification
                  onClose={() => setIsOpenNotification(false)}
                  notificationCount={notificationCount}
                  fetchNotifications={fetchNotifications}
                  className="right-0 top-82pxr"
                />
              )}
            </div>
          </div>
          <SelectingMode />
        </nav>
      </header>
    </>
  );
}
