const { body, validationResult } = require('express-validator');

const validationRules = req => {
  return [
    body('email').notEmpty().isEmail().withMessage('Invalid Email'),
    body('password')
      .notEmpty()
      .isLength({ min: 12 })
      .withMessage('Password must contain at least 12 characters'),
    body('confirmPassword').custom((value, { req }) => {
      console.log('再次確認密碼');
      console.log(value, req.body.password);
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
  ];
};

const validation = () => {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors });
      return;
    }
    next();
  };
};

module.exports = { validationRules, validation };
