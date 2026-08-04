import React from 'react';
import { cn } from '../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800/80',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 rounded-md w-3/4',
        variant === 'rectangular' && 'rounded-xl',
        className
      )}
      {...props}
    />
  );
};
