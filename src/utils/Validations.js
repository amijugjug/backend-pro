export const checkForNullOrNotAvaialble = (elementsArray) => {
  return elementsArray.some((element) => element && element?.trim === "");
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getLocalPathFromRequest = (req, fileName) => {
  if (!req.files) return null;

  const isFileExist = Object.keys(req?.files).includes(fileName);

  if (!isFileExist) return null;

  if (req?.files?.[fileName].length > 0)
    return req?.files?.[fileName]?.[0]?.path;
};

export const separateFilename = (filename) => {
  // Find the last occurrence of '.' to split the extension
  const lastDotIndex = filename.lastIndexOf(".");

  // If '.' is not found or it's the first character, return original filename
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return [filename, ""];
  }

  // Split the filename and extension
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex + 1);

  return [name, extension];
};

export const isAuthorizedUser = (currentUser, authorizedUser) => {
  const currentUserId = currentUser._id;
  const authorizedUserId = authorizedUser._id;
  return currentUserId === authorizedUserId;
};
