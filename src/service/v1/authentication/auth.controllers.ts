import { Response, Request } from "express";
import luxon from "luxon";
import { nanoid } from "nanoid";
import { Op } from "sequelize";
import userAgents from "express-useragent";
import locales from "../../../constants/locales";

import User from "../../../database/models";
import ForexBureau from "../../../database/models";

import * as STATUS_CODE from "../../../constants/status_code";
import jsonResponse from "@/helpers/jsonResponse";
import Token from "@/helpers/token";


const register = async (req: Request, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { email, password, password_confirmation, full_name, account_type, terms_accepted,  forex_details} = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { full_name }],
      },
    });

    if (user) {
      return jsonResponse({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        message: locales('UserExist', lang as string),
      });
    }

    if (password !== password_confirmation) {
      return jsonResponse({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        message: locales('PasswordMismatch', lang as string),
      });
    }

    const forexBureau = await ForexBureau.findOne({ where: { bureau_name: forex_details.bureau_name } });

    if (forexBureau) {
      return jsonResponse({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        message: locales('ForexBureauExist', lang as string),
      });
    }

    const newUser = await User.create({
      email,
      password,
      full_name,
      account_type,
      terms_accepted,
    });

    if(account_type === "forex_bureau"){
      await ForexBureau.create({
        user_id: newUser.id,
        bureau_name: forex_details.bureau_name,
        bureau_email: forex_details.bureau_email,
        bureau_phone_number: forex_details.bureau_phone_number,
        country: forex_details.country,
      });
    };

    return jsonResponse({
      res,
      status: STATUS_CODE.CREATED,
      message: locales('createdSuccessfully', lang as string),
      data: newUser,
    });
  } catch (error: any) {
    return jsonResponse({
      res,
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message,
    });
  }
};

export default {
  register,
}