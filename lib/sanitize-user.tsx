export const sanitize = (data: any) => {
  const removeConditions = ["password", "recoveryOtp", "recoverySentAt"];

  removeConditions.forEach((item) => {
    if (data.hasOwnProperty(item)) {
      delete data[item];
    }
  });
  return data;
};
