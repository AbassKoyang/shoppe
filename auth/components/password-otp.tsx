'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PasswordOTPProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onComplete'> {
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  maxLength?: number
  disabled?: boolean
  className?: string
  wrongPassword: boolean
}

const PasswordOTP = React.forwardRef<HTMLInputElement, PasswordOTPProps>(
  ({ className, value, onChange, onComplete, maxLength = 6, disabled, wrongPassword, ...props }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

    React.useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, maxLength);
    }, [maxLength]);

    const focusInput = (index: number) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]?.focus();
        setFocusedIndex(index);
      }
    };

    const handleInputChange = (index: number, inputValue: string) => {
      if (inputValue.length > 1) {
        // Handle paste or multiple character input
        const pastedValue = inputValue.slice(0, maxLength);
        const newValue = value.split('');
        
        for (let i = 0; i < pastedValue.length; i++) {
          if (index + i < maxLength) {
            newValue[index + i] = pastedValue[i];
          }
        }
        
        const finalValue = newValue.join('').slice(0, maxLength);
        onChange(finalValue);
        
        // Focus the next empty input or the last one
        const nextIndex = Math.min(index + pastedValue.length, maxLength - 1);
        focusInput(nextIndex);
      } else {
        // Handle single character input
        const newValue = value.split('');
        newValue[index] = inputValue;
        const finalValue = newValue.join('').slice(0, maxLength);
        onChange(finalValue);
        
        // Move to next input if current is filled
        if (inputValue && index < maxLength - 1) {
          focusInput(index + 1);
        }
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (value[index]) {
          // Clear current input
          const newValue = value.split('');
          newValue[index] = '';
          onChange(newValue.join(''));
        } else if (index > 0) {
          // Move to previous input and clear it
          const newValue = value.split('');
          newValue[index - 1] = '';
          onChange(newValue.join(''));
          focusInput(index - 1);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1);
      } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
        focusInput(index + 1);
      }
    };

    const handleFocus = (index: number) => {
      setFocusedIndex(index);
    };

    const handleBlur = () => {
      setFocusedIndex(-1);
    };

    React.useEffect(() => {
      if (value.length === maxLength && onComplete) {
        onComplete(value);
      }
    }, [value, maxLength, onComplete]);

    return (
      <div className={cn("flex gap-2", className)} ref={ref} {...props}>
        {Array.from({ length: maxLength }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
                inputRefs.current[index] = el;
              }}
            type="password"
            maxLength={maxLength}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-all duration-200",
              "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              wrongPassword ? "border-red-500 ring-2 ring-red-200" : focusedIndex === index 
                ? "border-blue-500 ring-2 ring-blue-200" 
                : "border-gray-300",
            )}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    );
  }
);

PasswordOTP.displayName = "PasswordOTP";

export { PasswordOTP };