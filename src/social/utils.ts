export const validatePrivateKey = (key: string) => {
  const regex = /^[a-f0-9]{64}$/;
  return regex.test(key);
};
