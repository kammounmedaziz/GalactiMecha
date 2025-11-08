import { body, validationResult } from 'express-validator';

const validateMessage = [
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('timestamp')
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO 8601 date'),
  body('sender')
    .isString()
    .withMessage('Sender must be a string')
    .notEmpty()
    .withMessage('Sender cannot be empty'),
];

const validateTelemetry = [
  body('temperature')
    .isFloat({ min: -100, max: 100 })
    .withMessage('Temperature must be a float between -100 and 100'),
  body('pressure')
    .isFloat({ min: 0 })
    .withMessage('Pressure must be a positive float'),
  body('altitude')
    .isFloat()
    .withMessage('Altitude must be a float'),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { validateMessage, validateTelemetry, validateRequest };