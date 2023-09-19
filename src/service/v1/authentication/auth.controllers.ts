import { Response, Request } from "express";
import luxon from "luxon";
import { nanoid } from "nanoid";
import { Op, Transaction } from "sequelize";
import userAgents from "express-useragent";
import locales from "../../../constants/locales";

import db from "../../../database/models";

import * as STATUS_CODE from "../../../constants/status_code";
import jsonResponse from "../../../helpers/jsonResponse";
import Token from "@/helpers/token";

const { User, ForexBureau } = db;

const register = async (req: Request, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { email, password, full_name, account_type, terms_accepted,  forex_details} = req.body;
  const transaction: Transaction = await db.sequelize.transaction();

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { full_name }],
      },
      transaction,
    });

    if (existingUser && existingUser.email === email) {
      transaction.rollback();
      return jsonResponse({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        message: locales('UserExist', lang as string),
      });
    }

    if (existingUser && existingUser.full_name === full_name) {
      transaction.rollback();
      return jsonResponse({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        message: locales('NameExist', lang as string),
      });
    }

    const newUser = await User.create({
      email,
      password,
      full_name,
      account_type,
      terms_accepted,
      is_forex_owner: account_type === "forex_bureau" ? true : false,
    });

    if(account_type === "forex_bureau"){
      const forexBureau = await ForexBureau.findOne({ where: { bureau_name: forex_details.bureau_name }, transaction });

      if (forexBureau) {
        await transaction.rollback();
        return jsonResponse({
          res,
          status: STATUS_CODE.BAD_REQUEST,
          message: locales('ForexBureauExist', lang as string),
        });
      }

      await ForexBureau.create({
        user_id: newUser.id,
        bureau_name: forex_details.bureau_name,
        bureau_email: forex_details.bureau_email,
        bureau_phone_number: forex_details.bureau_phone_number,
        country: forex_details.country,
      },
      {transaction}
      );
    };

    await transaction.commit();

    delete newUser.password;

    return jsonResponse({
      res,
      status: STATUS_CODE.CREATED,
      message: locales('createdSuccessfully', lang as string),
      data: newUser,
    });
  } catch (error: any) {
    await transaction.rollback();
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