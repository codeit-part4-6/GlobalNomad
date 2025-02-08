import Skeleton from '@/components/common/skeleton';
import Image from 'next/image';
import IconMeatball from '@/public/icon/ic_meatball.svg';

export default function SkeletonLayout() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto w-full px-24pxr pb-133pxr pt-16pxr tablet:min-w-696pxr tablet:pb-145pxr tablet:pt-24pxr pc:px-0 pc:pb-128pxr pc:pt-78pxr">
        <Skeleton className="mb-10pxr h-24pxr w-100pxr text-md font-normal text-nomad-black" />
        <div className="relative mb-16pxr flex flex-row justify-between">
          <Skeleton className="h-42pxr w-382pxr flex-row items-center gap-16pxr p-0 text-xl font-bold text-nomad-black tablet:text-3xl pc:text-3xl" />
          <Image src={IconMeatball} width={40} height={40} alt="자세히보기" priority />
        </div>
        <Skeleton className="flex h-24pxr w-382pxr flex-row gap-6pxr tablet:mb-25pxr pc:mb-25pxr" />
        <Skeleton className="my-32pxr mb-85pxr flex min-h-310pxr min-w-375pxr flex-row tablet:min-h-310pxr tablet:min-w-696pxr pc:min-h-534pxr pc:min-w-[75rem]" />
        <div className="flex flex-col first-letter:relative tablet:flex-row pc:flex-row">
          <div className="mb-16pxr mr-24pxr w-auto min-w-327pxr tablet:min-w-428pxr pc:min-w-790pxr">
            <hr />
            <div>
              <div className="w-full pb-16pxr pt-15pxr text-xl font-bold text-nomad-black tablet:pb-16pxr tablet:pt-41pxr pc:pb-34pxr pc:pt-40pxr">
                체험 설명
              </div>
              <Skeleton className="text-nomad mb-16pxr h-auto min-h-200pxr min-w-327pxr text-xl font-normal opacity-75 tablet:mb-57pxr tablet:min-w-428pxr pc:mb-34pxr pc:min-w-790pxr" />
            </div>
            <hr />
            <Skeleton className="h-480pxr w-full pb-40pxr pt-16pxr text-xl font-bold text-nomad-black tablet:h-570pxr tablet:pb-42pxr tablet:pt-40pxr pc:h-570pxr pc:pb-34pxr" />
            <hr />
          </div>
          <Skeleton className="h-85pxr rounded-xl border border-solid border-gray-200 bg-white px-24pxr pb-18pxr pt-24pxr shadow-sidenavi-box tablet:h-423pxr tablet:min-w-270pxr pc:h-748pxr pc:min-w-384pxr" />
        </div>
      </div>
    </div>
  );
}
