import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            'flex h-9 w-full shadow-md shadow-[#00000010] border-[#00000025] bg-transparent text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border rounded-full px-8 py-6 bg-white',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <label className="text-destructive text-sm">{error}</label>
        ) : (
          <div className="h-[20px]"></div>
        )}
      </>
    );
  },
);
Input.displayName = 'Input';

export { Input };
