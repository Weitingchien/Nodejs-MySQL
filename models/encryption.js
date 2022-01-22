const crypto = require('crypto-js');

const encryption = password => {
  let hashPassword = crypto.SHA256(password).toString();
  return hashPassword;
};

module.exports = encryption;
