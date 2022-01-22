const error = (data, reject) => {
  data.status = 500;
  data.error = '伺服器錯誤，請稍後再試';
  reject(data);
  return;
};

module.exports = error;
