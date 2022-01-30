const { body, validationResult } = require('express-validator');
const dbConnect = require('../config/db');
const path = require('path');

const search = () => {
  return new Promise((resolve, reject) => {
    dbConnect.query('SELECT * FROM member', (err, result) => {
      let dataForRendering = [];
      if (err) {
        reject(err);
        return;
      }
      result.forEach((user, index) => {
        delete user.password;
      });
      dataForRendering = result;
      resolve(dataForRendering);
    });
  });
};

const registerValidationRules = () => {
  return [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('名字必填，不能為空')
      .isLength({ min: 4, max: 15 })
      .withMessage('名字的長度最小為4，最大為15個字元')
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          dbConnect.query(
            'SELECT username FROM member WHERE username = ?',
            req.body.username,
            (err, result) => {
              if (err) {
                reject(new Error('Server Error'));
              }
              if (result.length >= 1) {
                reject(new Error('這個名稱已被使用'));
              }
              resolve(true);
            }
          );
        });
      }),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('電子郵件必填，不能為空')
      .isEmail()
      .withMessage('電子郵件的格式錯誤')
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          dbConnect.query(
            'SELECT email FROM member WHERE email = ?',
            req.body.email,
            (err, result) => {
              if (err) {
                reject(new Error('Server Error'));
              }
              if (result.length >= 1) {
                reject(new Error('這個E-mail已被使用'));
              }
              resolve(true);
            }
          );
        });
      }),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('密碼必填，不能為空')
      .isLength({ min: 12, max: 64 })
      .withMessage('密碼的長度最小為12，最大為64'),
    body('confirm-password')
      .trim()
      .custom((value, { req }) => {
        console.log(value, req.body.password);
        if (value !== req.body.password) {
          throw new Error('確認密碼與密碼不符');
        }
        return true;
      })
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('電子郵件必填，不能為空')
      .isEmail()
      .withMessage('電子郵件的格式錯誤'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('密碼必填，不能為空')
      .isLength({ min: 12, max: 64 })
      .withMessage('密碼的長度最小為12，最大為64')
  ];
};

// admin Page
const updatedMemberInfoValidationRules = () => {
  console.log('執行 updatedMemberInfoValidationRules函式');
  return [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('名字必填，不能為空')
      .isLength({ min: 4, max: 15 })
      .withMessage('名字的長度最小為4，最大為15個字元')
      .custom((value, { req }) => {
        console.log(req.userId);
        return new Promise((resolve, reject) => {
          dbConnect.query(
            'SELECT username FROM member WHERE username = ?',
            [req.body.username],
            (err, result) => {
              if (err) {
                reject(new Error('Server Error'));
              }
              if (result.length >= 2) {
                reject(new Error('這個名稱已被使用'));
              }
              resolve(true);
            }
          );
        });
      }),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('電子郵件必填，不能為空')
      .isEmail()
      .withMessage('電子郵件的格式錯誤')
      .custom((value, { req }) => {
        return new Promise((resolve, reject) => {
          dbConnect.query(
            'SELECT email FROM member WHERE email = ?',
            req.body.email,
            (err, result) => {
              if (err) {
                reject(new Error('Server Error'));
              }
              if (result.length >= 2) {
                reject(new Error('這個E-mail已被使用'));
              }
              resolve(true);
            }
          );
        });
      })
  ];
};

const classificationError = errors => {
  const errorsArr = errors.array();
  const errorsMes = {
    errorMesOfUsername: null,
    errorMesOfEmail: null,
    errorMesOfPassword: null,
    errorMesOfConfirmPassword: null
  };

  for (let i = 0; i < errorsArr.length; i++) {
    errorsMes.errorMesOfUsername = errorsArr.filter(
      el => el.param === 'username'
    );
    errorsMes.errorMesOfEmail = errorsArr.filter(el => el.param === 'email');
    errorsMes.errorMesOfPassword = errorsArr.filter(
      el => el.param === 'password'
    );
    errorsMes.errorMesOfConfirmPassword = errorsArr.filter(
      el => el.param === 'confirm-password'
    );
  }
  return errorsMes;
};

const validation = async (req, res, next) => {
  console.log('執行 validation函式');
  const resUrl = req.url;
  console.log(resUrl);
  const errors = validationResult(req);
  let errorsMesCache = {};

  if (!errors.isEmpty()) {
    const classificationResult = classificationError(errors);
    errorsMesCache = classificationResult;

    if (resUrl === '/register') {
      return res
        .status(400)
        .render(path.join(__dirname, '../views/index.ejs'), {
          currentPage: 'Register',
          errUsername: errorsMesCache.errorMesOfUsername,
          errEmail: errorsMesCache.errorMesOfEmail,
          errPassword: errorsMesCache.errorMesOfPassword,
          errConfirmPassword: errorsMesCache.errorMesOfConfirmPassword,
          userID: false
        });
    } else if (resUrl === '/login') {
      return res
        .status(400)
        .render(path.join(__dirname, '../views/index.ejs'), {
          currentPage: 'Login',
          errEmail: errorsMesCache.errorMesOfEmail,
          errPassword: errorsMesCache.errorMesOfPassword
        });
    } else if (resUrl === '/membersinfo') {
      const result = await search();
      return res
        .status(400)
        .render(path.join(__dirname, '../views/index.ejs'), {
          currentPage: 'Admin_AllMemberInfo',
          errUsername: errorsMesCache.errorMesOfUsername,
          errEmail: errorsMesCache.errorMesOfEmail,
          allUser: result
        });
    }
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updatedMemberInfoValidationRules,
  validation
};
