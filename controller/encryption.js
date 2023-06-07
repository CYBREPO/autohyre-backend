const CryptoJS = require('crypto-js');

  //The set method is use for encrypt the value.
exports.encrypt = (value) => {
    var key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTIONKEY);
    var iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTIONKEY);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 16,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString(CryptoJS.format.Hex);
  }

  //The get method is use for decrypt the value.
  exports.decrypt = (value) => {
    var key = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTIONKEY);
    var iv = CryptoJS.enc.Utf8.parse(process.env.ENCRYPTIONKEY);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      format: CryptoJS.format.Hex  // To Decrypt in Hex format
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }