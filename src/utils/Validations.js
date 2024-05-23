export const checkForNullOrNotAvaialble = (elementsArray) => {
  return elementsArray.some((element) => element && element?.trim === "");
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
