'use client';
import React from 'react';

interface ButtonType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Button({className = '', type = 'button', disabled = false, children, onClick, ...props}: ButtonType) {
  return (
    <button className={className} disabled={disabled} type={type} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
