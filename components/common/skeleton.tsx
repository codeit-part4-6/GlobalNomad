import styles from '@/styles/skeleton.module.css';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}
export default function Skeleton({className = '', children}: SkeletonProps) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
