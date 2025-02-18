import {useEffect} from 'react';

export default function DisableScroll(isOpen: boolean) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
}
