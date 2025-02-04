import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';

export interface SelectBoxType {
  className?: string;
  options: {value: string; label: string; disabled?: boolean}[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectButtonImage?: string;
  onDelete?: () => void;
  label?: string;
}

export default function SelectBox({className = '', options, value, onChange, selectButtonImage, onDelete, label}: SelectBoxType) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => setIsOpen(prev => !prev);

  const handleOptionSelect = (value: string) => {
    const event = {target: {value}} as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    setIsOpen(false);
  };

  const handleDelete = () => {
    const event = {target: {value: ''}} as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    if (onDelete) onDelete();
  };

  return (
    <div className={`relative ${className}`}>
      {/* 선택된 값 표시 및 드롭다운 토글 버튼 */}
      <div onClick={handleToggleDropdown} className="flex cursor-pointer items-center justify-between rounded-e rounded-s border border-gray-700 p-4">
        <span>{selectedLabel || '선택하세요'}</span>
        <button type="button" onClick={handleDelete} className="ml-2">
          {selectButtonImage ? (
            <Image src={selectButtonImage} alt="선택" width={24} height={24} layout="intrinsic" className="h-6 w-6" />
          ) : (
            <span className="text-red-500">🗑️</span>
          )}
        </button>
      </div>

      {/* 드롭다운 */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute left-0 right-0 top-full z-10 mt-2 rounded-lg border bg-white shadow-lg">
          <ul className="max-h-60 overflow-y-auto">
            {options.map(option => (
              <li
                key={option.value}
                className={`m-2 cursor-pointer rounded-md p-2 hover:bg-nomad-black hover:text-white`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className={`text-lg font-normal`}>{option.label}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
