'use client';
import {useCallback, useEffect, useRef} from 'react';

export interface Item {
  id: number;
  label: string;
  type?: string;
}

interface DropboxProps {
  className?: string;
  items: Item[];
  onClick?: (type: string) => void;
  onClose?: () => void;
}

export default function Dropbox({className = 'w-auto', items = [], onClick, onClose}: DropboxProps) {
  const dropboxRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (dropboxRef.current && !dropboxRef.current.contains(event.target as Node)) {
        if (onClose) {
          onClose();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={dropboxRef} className={`absolute cursor-pointer ${className}`}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const roundedClass = isFirst ? 'rounded-t-md' : isLast ? 'rounded-b-md' : '';

        return (
          <div
            onClick={() => onClick && onClick(item.type || '')}
            key={item.id}
            className={`${roundedClass} border border-gray-200 bg-white py-9pxr text-center hover:bg-gray-200 focus:bg-gray-300 dark:border-gray-800 dark:bg-stone-800 pc:py-18pxr`}
          >
            <div className="text-lg text-gray-800 dark:text-gray-50 dark:hover:text-gray-50">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
