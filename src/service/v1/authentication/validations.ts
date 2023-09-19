import { Joi, celebrate, Segments } from "celebrate";
import { RequestHandler } from "express";

export const registerValidation: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .required()
      .min(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/),
    password_confirmation: Joi.string().required().valid(Joi.ref("password")),
    full_name: Joi.string().required().min(3),
    account_type: Joi.string()
      .required()
      .valid("personal_account", "forex_bureau"),
    terms_accepted: Joi.boolean().valid(true),
    forex_details: Joi.object()
      .keys({
        bureau_name: Joi.string().required().min(3),
        bureau_phone_number: Joi.string().required(),
        bureau_email: Joi.string().email().required(),
        country: Joi.string()
          .required()
          .valid("kenya", "rwanda", "uganda", "congo"),
      })
      .when("account_type", {
        is: "forex_bureau",
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
  }),
});

export const loginValidation: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const refreshTokenValidation: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    refresh_token: Joi.string().required().min(50),
  }),
});

