import CryptoJS from 'crypto-js';

const encPassword = "AM%AsMfZs" + "a2fYU%9";


export function aesEncrypt(src: any) {
  const key = CryptoJS.enc.Utf8.parse(encPassword);
  const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function aesDecrypt(encrypted: any) {
  try {
    const ciphertext = CryptoJS.enc.Base64.parse(encrypted);
    const key = CryptoJS.enc.Utf8.parse(encPassword);
    const iv = CryptoJS.lib.WordArray.create(key.words.slice(0, 4));
    const decryptConfig = {
      iv: iv,
      mode: CryptoJS.mode.CTR,
      padding: CryptoJS.pad.NoPadding
    };
    const decrypted = CryptoJS.AES.decrypt(
      // @ts-ignore
      { ciphertext: ciphertext },
      key,
      decryptConfig
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('AES解密失败:', error);
    return '';
  }
}