import {Joi, celebrate, Segments} from 'celebrate';
import {RequestHandler} from 'express';

export const registerValidation: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    full_name: Joi.string().required().min(3),
    account_type: Joi.string().required().valid('personal_account', 'forex_bureau'),
    terms_accepted: Joi.boolean().required().valid(true),
    forex_details: Joi.object().keys({
      bureau_name: Joi.string().required().min(3),
      bureau_phone_number: Joi.string().required(),
      country: Joi.string().required().valid("kenya", "rwanda", "uganda", "congo")
    }),
  }),
});