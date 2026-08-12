import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().allow('').default(''),
  DB_NAME: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),  // Sin fallback
  JWT_EXPIRES_IN: Joi.string().default('30m'),

  // CORS / Cookies
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
  COOKIE_SECURE: Joi.boolean().default(false),

  // Dev
  DEV_BYPASS_AUTH: Joi.boolean().default(false),

  // App
  PORT: Joi.number().port().default(4000),
  HOST: Joi.string().default('0.0.0.0'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
}).unknown(true);