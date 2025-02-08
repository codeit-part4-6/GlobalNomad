import React from 'react';
import Button from '@/components/common/button';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import ModalComponent from './modal';
import InputPage from './InputPage';
import Mypage from '../../components/side-navigation/mypage';
import PagenationComponent from './pagenation';
import KakaoMap from './kakomap';
import Dropbox from '@/components/common/dropbox';
import InfinitePage from './InfinitePage';

async function Page() {
  const data = await new Promise<string>(resolve => setTimeout(() => resolve('비동기 데이터 1초'), 1000));

  return (
    <ul>
      <li>
        <div className="bg-gray-700 text-2xl font-bold">test</div>
      </li>
      <li>
        <div className="bg-primary text-xl font-semibold text-secondary">test</div>
      </li>
      <li>
        <div className="bg-orange-50 text-md font-medium text-accent-green">test</div>
      </li>
      <li>
        <ModalComponent />
      </li>
      <li>
        <Navbar />
      </li>
      <li>
        <Button
          className={
            'm-5 h-56pxr w-96pxr flex-row items-center justify-center gap-4pxr rounded-lg border-slate-800 bg-nomad-black px-8pxr text-center align-middle text-white tablet:w-136pxr pc:w-136pxr'
          }
        >
          검색하기
        </Button>
      </li>
      <li>
        <div className="m-5 mt-0 h-24pxr w-150pxr">{data}</div>
      </li>
      <hr />
      <br />
      <ul className="flex items-center">
        <li>
          <InputPage />
        </li>
        <li className="relative">
          <Dropbox
            items={[
              {id: 1, label: '수정하기', type: 'modify'},
              {id: 2, label: '삭제하기', type: 'delete'},
              {id: 3, label: '등록하기', type: 'register'},
            ]}
            className="w-160pxr"
          />
        </li>
      </ul>
      <li>
        <Mypage />
        <Footer />
        <PagenationComponent />
      </li>
      <hr />
      <li>
        <KakaoMap address="서울 중구 청계천로 100" houseName="코드잇" />
      </li>
      <li>
        <InfinitePage />
      </li>
    </ul>
  );
}

export default Page;
