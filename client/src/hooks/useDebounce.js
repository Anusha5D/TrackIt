import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value`. The debounced value only updates
 * after `delay` ms have passed without `value` changing.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 300);
 *   useEffect(() => { fetch(...) }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timer — when `value` changes, schedule an update
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If `value` changes again before the timer fires, the cleanup
    // function cancels it — that's the whole trick.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};