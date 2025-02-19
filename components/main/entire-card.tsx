import Image from 'next/image';
import Link from 'next/link';
import {ActivitiesResponse} from '@/types/activities';
import Star from '@/public/icon/ic_yellowStar.svg';

interface EntireCardProps {
  data?: ActivitiesResponse;
}

export default function EntireCard({data}: EntireCardProps) {
  return (
    <div className="flex w-full flex-col">
      {/* 카드 리스트 (Grid 레이아웃) */}
      <div className="grid w-full grid-cols-2 gap-x-2 gap-y-4 tablet:grid-cols-3 tablet:gap-x-8 tablet:gap-y-6 pc:grid-cols-4 pc:gap-x-6 pc:gap-y-12">
        {data?.activities?.map(({title, price, bannerImageUrl, rating, reviewCount, id}) => (
          <div key={id} className="flex flex-col gap-4">
            <Link href={`/activities/${id}`}>
              {/* 배경 이미지 */}
              <div className="relative flex h-[186px] w-full overflow-hidden rounded-3xl bg-gray-300 tablet:h-[221px] pc:h-[283px] pc:min-w-[283px]">
                <Image
                  src={bannerImageUrl}
                  alt={title}
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 745px) 100vw, (max-width: 1200px) 80vw, 50vw"
                />
              </div>

              {/* 카드 내용 */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image src={Star} alt="별" width={18} height={18} />
                  <span className="text-sm font-semibold">
                    {rating} ({reviewCount})
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-black-100 tablet:text-xl dark:text-gray-500">{title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-md font-semibold tablet:text-lg">₩ {price.toLocaleString()}</span>
                  <span className="text-sm font-regular text-gray-600">/ 인</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
