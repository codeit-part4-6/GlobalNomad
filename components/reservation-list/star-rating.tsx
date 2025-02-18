import React, {useState, useRef} from 'react';
import Image from 'next/image';
import star from '@/public/icon/ic_star.svg';
import unStar from '@/public/icon/ic_unstar.svg';

export default function StarRating({setStarRating, starRating}: {setStarRating: (rating: number) => void; starRating: number}) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const starContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && starContainerRef.current) {
      const {left, width} = starContainerRef.current.getBoundingClientRect();
      const newRating = Math.ceil(((e.clientX - left) / width) * 5);
      setStarRating(newRating);
    }
  };

  const ratingStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <div key={i + 1} className="relative h-14 w-14 cursor-pointer" onClick={() => setStarRating(i + 1)}>
          {i + 1 <= starRating ? (
            <Image src={star} alt="별점 이미지" className="absolute" fill />
          ) : (
            <Image src={unStar} alt="별점 이미지" className="absolute" fill />
          )}
        </div>,
      );
    }
    return stars;
  };

  return (
    <div
      ref={starContainerRef}
      className="mb-3 flex items-center justify-center gap-2 px-4 py-22pxr tablet:mb-6"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {ratingStars()}
    </div>
  );
}
