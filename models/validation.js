const { body, validationResult } = require('express-validator');
const path = require('path');

const validationRules = () => {
  return [
    body('username').notEmpty().isLength({ max: 15 }),
    body('email').notEmpty().isEmail().withMessage('Invalid Email'),
    body('password')
      .notEmpty()
      .isLength({ min: 12, max: 64 })
      .withMessage('Password must contain at least 12 characters'),
    body('confirm-password').custom((value, { req }) => {
      console.log(value, req.body.password);
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ];
};

const validation = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render(path.join(__dirname, '../views/index.ejs'), {
      currentPage: 'Register',
      isLogin: false,
      errorMessages: errors.array(),
      user: { email, password, confirmPassword }
    });
  }
  next();
};

module.exports = { validationRules, validation };
