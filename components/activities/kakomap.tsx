'use client';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import LocationIcon from '@/public/icon/icon_location.svg';
import Button from '../common/button';

interface KakaoMapType {
  address: string;
  houseName?: string;
}

export default function KakaoMap({address, houseName}: KakaoMapType) {
  const [mapType, setMapType] = useState<string>('roadmap');

  const handleMapTypeChange = (type: string) => {
    setMapType(type);
  };

  useEffect(() => {
    const loadKakaoMapScript = () => {
      // script를 만들어서 추가시켜준다.
      const kakaoMapScript = document.createElement('script');
      kakaoMapScript.async = true;
      kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;

      document.head.appendChild(kakaoMapScript);

      kakaoMapScript.onload = () => {
        kakao.maps.load(() => {
          // 지도를 표시할 div
          const mapContainer = document.getElementById('map');
          const mapOptions = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3, // 지도의 확대 레벨
          };

          if (mapContainer) {
            // 지도를 생성합니다
            const map = new kakao.maps.Map(mapContainer, mapOptions);

            // 주소-좌표 변환 객체를 생성합니다
            const geocoder = new kakao.maps.services.Geocoder();

            // 주소로 좌표를 검색합니다
            geocoder.addressSearch(address, (result, status) => {
              // 정상적으로 검색이 완료됐으면
              if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(+result[0].y, +result[0].x);
                // 결과값으로 받은 위치를 마커로 표시합니다
                const marker = new kakao.maps.Marker({
                  map: map,
                  position: coords,
                });
                marker.setMap(map);

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                const customOverlay = new kakao.maps.CustomOverlay({
                  position: coords,
                  content: `<div class="info-title">${houseName}</div>`,
                });
                customOverlay.setMap(map);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
              } else {
                console.error('주소를 찾지 못했습니다.');
              }
            });

            const roadmapControl = document.getElementById('btnRoadmap');
            const skyviewControl = document.getElementById('btnSkyview');

            if (roadmapControl && skyviewControl) {
              if (mapType === 'roadmap') {
                map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
              } else {
                map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
              }
            }
          }
        });
      };
    };

    loadKakaoMapScript();
  }, [address, houseName, mapType]);

  return (
    <>
      <div id="map_wrap" className="relative">
        <div
          id="map"
          className={'m-0 min-h-481pxr min-w-327pxr rounded-2xl tablet:min-h-308pxr tablet:min-w-429pxr pc:min-h-476pxr pc:min-w-800pxr'}
        />
        <div className="absolute right-10pxr top-10pxr z-[1] m-0 bg-inherit p-0">
          <Button
            id="btnRoadmap"
            className={`mr-2pxr w-70pxr rounded-l-lg text-xs ${mapType === 'roadmap' ? 'bg-blue-200' : 'border border-blue-200 bg-white text-black-50'}`}
            onClick={() => handleMapTypeChange('roadmap')}
          >
            지도
          </Button>
          <Button
            id="btnSkyview"
            className={`w-70pxr rounded-r-lg text-xs ${mapType === 'skyview' ? 'bg-blue-200' : 'border border-blue-200 bg-white text-black-50'}`}
            onClick={() => handleMapTypeChange('skyview')}
          >
            스카이뷰
          </Button>
        </div>
      </div>
      <div className={'flex flex-wrap'}>
        <Image className="m-0 mr-1" src={LocationIcon} alt="Location" width={18} height={18} />
        <div className="text-md font-normal text-nomad-black opacity-75">{address}</div>
      </div>
      <style>
        {`
          .info-title {
            position:relative;
            bottom:60px;
            background: white;
            color: black;
            border: 2px solid #0ea5e9;
            text-align: center;
            line-height: 22px;
            border-radius: 8px;
            padding: 3px;
            margin: -1px -1px;
            font-size: 1rem;
            font-weight: 500 !important;
          }
        `}
      </style>
    </>
  );
}
