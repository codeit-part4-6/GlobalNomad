import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectBoxType {
  className?: string;
  options: SelectOption[];
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

  const optionRefs = useRef<{[key: string]: HTMLLIElement | null}>({});

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

  useEffect(() => {
    if (isOpen && value && optionRefs.current[value]) {
      optionRefs.current[value]?.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      });
    }
  }, [isOpen, value]);

  return (
    <div className={`relative ${className}`}>
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
                ref={el => {
                  optionRefs.current[option.value] = el;
                }}
                className={`m-2 cursor-pointer rounded-md p-2 ${option.value === value ? 'bg-nomad-black text-white' : 'hover:bg-nomad-black hover:text-white'}`}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className={`text-lg font-normal ${option.value === value && 'bg-nomad-black text-white'}`}>{option.label}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
