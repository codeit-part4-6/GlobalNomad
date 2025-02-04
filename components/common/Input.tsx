import React, {useState} from 'react';
import eyesOn from '@/public/icon/ic_eyes_on.svg';
import eyesOff from '@/public/icon/ic_eyes_off.svg';
import Image from 'next/image';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  labelClassName?: string;
  isMoney?: boolean;
  isPassword?: boolean;
}

const INPUT_STYLES = {
  base: 'px-4 py-2 border leading-10 border-gray-700 rounded-[0.25rem] text-lg focus:outline-none',
  focus: 'focus:ring-2 focus:ring-green-950',
  placeholder: 'placeholder-gray-700 placeholder:text-lg',
  state: {
    enabled: 'hover:opacity-80',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  error: 'border-red-500',
  label: 'block text-xl tablet:text-2xl font-bold mb-3',
  errorMessage: 'ml-2 text-red-200 text-xs mt-2',
};

const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  value = '',
  onChange,
  onBlur,
  className = '',
  labelClassName = '',
  isMoney = false,
  type = 'text',
  isPassword = false,
  ...props
}: InputProps) => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const formatMoney = (val: string | number): string => {
    const num = Number(val);
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = '';
    if (isMoney) {
      value = e.target.value.replace(/,/g, '').replace(/[^\d]/g, '');
    } else {
      value = e.target.value;
    }

    if (onChange) onChange({...e, target: {...e.target, value}});
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let newValue = value;
    if (isMoney) {
      newValue = formatMoney(value);
    }
    if (onBlur) {
      onBlur({
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      });
    }
  };

  const inputClassNames = [
    INPUT_STYLES.base,
    error ? INPUT_STYLES.error : '',
    INPUT_STYLES.focus,
    INPUT_STYLES.placeholder,
    props.disabled ? INPUT_STYLES.state.disabled : INPUT_STYLES.state.enabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelClassNames = labelClassName || INPUT_STYLES.label;

  return (
    <div>
      {/* Label (Optional) */}
      {label && (
        <label htmlFor={props.name} className={labelClassNames}>
          {label}
        </label>
      )}
      {/* Input */}
      <div className="relative">
        <input
          {...props}
          required={required}
          value={isMoney ? formatMoney(value) : value}
          onChange={handleChange}
          onBlur={handleBlur}
          type={isPassword && isPasswordShow ? 'text' : type}
          className={inputClassNames}
          autoComplete="current-password"
        />
        {isPassword === true && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
            <Image
              src={isPasswordShow ? eyesOn : eyesOff}
              onClick={() => setIsPasswordShow(!isPasswordShow)}
              alt={isPasswordShow ? '비밀번호 숨기기' : '비밀번호 표시'}
              width={24}
              height={24}
            />
          </span>
        )}
      </div>
      {/* Error message */}
      <span className={`${INPUT_STYLES.errorMessage} ${error ? 'visible opacity-100' : 'invisible opacity-0'}`}>{error}</span>
    </div>
  );
};

export default Input;
