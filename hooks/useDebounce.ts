import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * Prevents rapid-fire function calls that can cause performance issues
 */
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 150
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    } as T,
    [func, delay]
  );
}

