import {useState} from 'react';
import Image from 'next/image';
import {ReviewModalProps} from '@/types/review-modal-props';
import Button from '../common/button';
import OverlayContainer from '@/components/common/modal/overlay-container';
import Modal from '@/components/common/modal/modal';
import StarRating from '@/components/reservation-list/star-rating';
import {postReview} from '@/service/api/reservation-list/postReview.api';
import {useMutation} from '@tanstack/react-query';
import {ScaleLoader} from 'react-spinners';
import FormattedPrice from '@/utils/formatted-price';
import FormatDate from '@/utils/format-date';
import closeButton from '@/public/icon/ic_close_button.svg';

export default function ReviewModal({data, message, onClose}: ReviewModalProps) {
  const [starRating, setStarRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const mutation = useMutation({
    mutationFn: async () => {
      if (data !== undefined) {
        const response = await postReview(data.id, content, starRating);
        return response;
      }
    },
    onMutate: () => {
      setLoading(true);
    },

    onSuccess: () => {
      setLoading(false);
      setIsModalOpen(true);
      setModalMessage('후기 작성에 성공했습니다.');
    },
    onError: error => {
      setLoading(false);
      setIsModalOpen(true);
      setModalMessage(`${error.message}`);
    },
  });

  const handlePostReview = () => {
    mutation.mutate();
  };

  if (!data) {
    return null;
  }

  return (
    <OverlayContainer onClose={onClose}>
      <div onClick={e => e.stopPropagation()} className="review-modal no-scrollbar">
        <div className="mb-35pxr flex items-center justify-between tablet:mb-41pxr">
          <p className="text-[1.75rem] font-bold text-black-100 tablet:text-2xl">{message}</p>
          <div className="relative h-12 w-12 tablet:h-10 tablet:w-10" onClick={onClose}>
            <Image src={closeButton} alt="모달 닫기 버튼" className="absolute cursor-pointer" fill />
          </div>
        </div>
        <div className="mb-3 flex items-center gap-6pxr tablet:mb-6 tablet:gap-6">
          <div className="relative h-100pxr w-100pxr tablet:h-126pxr tablet:w-126pxr">
            <Image src={data?.activity.bannerImageUrl} alt="체험 배너 이미지" className="absolute rounded-xl" fill />
          </div>
          <div className="flex flex-grow flex-col gap-2 tablet:gap-2">
            <p className="text-lg font-bold text-nomad-black tablet:text-xl">{data?.activity.title}</p>
            <div className="border-nomad-black/10 mb-6pxr flex items-center border-b pb-6pxr text-md font-regular text-nomad-black tablet:mb-3 tablet:pb-3 tablet:text-2lg">
              <p>
                {FormatDate(data.date)} · {data.startTime} - {data.endTime} · {data.headCount}명
              </p>
            </div>
            <p className="text-xl font-bold leading-none text-nomad-black tablet:text-3xl">￦{FormattedPrice(data?.totalPrice)}</p>
          </div>
        </div>
        <StarRating starRating={starRating} setStarRating={setStarRating} />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="후기를 작성해주세요"
          className="mb-6 h-346pxr min-h-346pxr w-full resize-none rounded border border-gray-700 px-4 py-2 placeholder-gray-700 placeholder:text-lg placeholder:font-regular tablet:h-60 tablet:min-h-60"
        />
        <Button
          className={
            'nomad-button-hover h-54pxr min-h-54pxr w-full rounded-md bg-nomad-black px-8pxr text-center text-lg font-bold text-white disabled:cursor-not-allowed tablet:h-56pxr tablet:min-h-56pxr tablet:rounded'
          }
          onClick={handlePostReview}
          disabled={loading}
        >
          <div className="flex items-center justify-center gap-3">{loading ? <ScaleLoader width={3} height={20} color="#ffffff" /> : '작성하기'}</div>
        </Button>
      </div>
      {isModalOpen && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setIsModalOpen(false);
            onClose();
          }}
        />
      )}
    </OverlayContainer>
  );
}
