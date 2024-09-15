export const debounce = (func, delay) => {
  let timeoutId;
  
  const debouncedFunc = (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
  
  debouncedFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  return debouncedFunc;
};
