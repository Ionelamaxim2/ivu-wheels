"use client";

import { useState, useEffect, useCallback, useRef } from "react";
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = now;
      }
    }, delay - (Date.now() - lastExecuted.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastExecuted = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        callback(...args);
        lastExecuted.current = now;
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}
export function useSearch<T>(
  items: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean,
  delay: number = 300
) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const [results, setResults] = useState<T[]>(items);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults(items);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const searchTimeout = setTimeout(() => {
      const filtered = items.filter((item) =>
        searchFn(item, debouncedSearchTerm.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 0);

    return () => clearTimeout(searchTimeout);
  }, [debouncedSearchTerm, items, searchFn]);

  return { results, isSearching };
}
export function useValidation<T extends Record<string, any>>(
  values: T,
  validators: { [K in keyof T]?: (value: T[K]) => string | null },
  delay: number = 500
) {
  const debouncedValues = useDebounce(values, delay);
  const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsValidating(true);

    const newErrors: { [K in keyof T]?: string } = {};

    Object.keys(validators).forEach((key) => {
      const validator = validators[key as keyof T];
      if (validator) {
        const error = validator(debouncedValues[key as keyof T]);
        if (error) {
          newErrors[key as keyof T] = error;
        }
      }
    });

    setErrors(newErrors);
    setIsValidating(false);
  }, [debouncedValues, validators]);

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid, isValidating };
}
