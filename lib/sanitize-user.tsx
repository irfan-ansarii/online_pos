export const sanitize = (data: any) => {
  const removeConditions = ["password", "recoveryToken", "recoveryTokenSentAt"];

  removeConditions.forEach((item) => {
    if (data.hasOwnProperty(item)) {
      delete data[item];
    }
  });
  return data;
};
