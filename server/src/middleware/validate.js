import { body, param, query, validationResult } from 'express-validator';

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required (max 255 chars)'),
  body('name_bg').optional({ values: 'null' }).trim().isLength({ max: 255 }),
  body('price').isFloat({ min: 0, max: 99999.99 }).withMessage('Price must be between 0 and 99999.99'),
  body('category_id').isUUID(4).withMessage('Valid category is required'),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('description_bg').optional({ values: 'null' }).trim().isLength({ max: 5000 }),
  body('featured').optional().isBoolean(),
  body('is_new').optional().isBoolean(),
  body('gradient').optional().trim().isLength({ max: 500 }),
  body('sizes').optional().isArray(),
  body('sizes.*').optional().isUUID(4),
  body('colors').optional().isArray(),
  body('colors.*').optional().isUUID(4),
  body('pieces').optional().isArray(),
  body('pieces.*.name').optional().trim().isLength({ min: 1, max: 255 }),
  body('pieces.*.price').optional().isFloat({ min: 0, max: 99999.99 }),
  handleValidationErrors,
];

export const validateProductUpdate = [
  param('id').isUUID(4).withMessage('Invalid product ID'),
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('name_bg').optional({ values: 'null' }).trim().isLength({ max: 255 }),
  body('price').optional().isFloat({ min: 0, max: 99999.99 }),
  body('category_id').optional().isUUID(4),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('description_bg').optional({ values: 'null' }).trim().isLength({ max: 5000 }),
  body('featured').optional().isBoolean(),
  body('is_new').optional().isBoolean(),
  body('gradient').optional().trim().isLength({ max: 500 }),
  body('sizes').optional().isArray(),
  body('sizes.*').optional().isUUID(4),
  body('colors').optional().isArray(),
  body('colors.*').optional().isUUID(4),
  body('pieces').optional().isArray(),
  body('pieces.*.name').optional().trim().isLength({ min: 1, max: 255 }),
  body('pieces.*.price').optional().isFloat({ min: 0, max: 99999.99 }),
  handleValidationErrors,
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  handleValidationErrors,
];

export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('first_name').optional().trim().isLength({ max: 100 }),
  body('last_name').optional().trim().isLength({ max: 100 }),
  handleValidationErrors,
];

export const validateCartItem = [
  body('product_id').isUUID(4).withMessage('Valid product ID is required'),
  body('size').optional().trim().isLength({ max: 20 }),
  body('color').optional().trim().isLength({ max: 50 }),
  body('quantity').optional().isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
  handleValidationErrors,
];

export const validateCartUpdate = [
  param('id').isUUID(4).withMessage('Invalid cart item ID'),
  body('quantity').isInt({ min: 0, max: 99 }).withMessage('Quantity must be between 0 and 99'),
  handleValidationErrors,
];

export const validateUuidParam = [
  param('id').isUUID(4).withMessage('Invalid ID'),
  handleValidationErrors,
];

export const validateImageReorder = [
  param('id').isUUID(4).withMessage('Invalid product ID'),
  body('imageIds').isArray({ min: 1 }).withMessage('Image IDs array is required'),
  body('imageIds.*').isUUID(4),
  handleValidationErrors,
];
