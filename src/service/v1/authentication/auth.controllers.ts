import { Response, Request } from "express";
import luxon from "luxon";
import jwt from "jsonwebtoken";
import { Op, Transaction } from "sequelize";
import userAgents from "express-useragent";
import locales from "../../../constants/locales";
import bcrypt from "bcryptjs";

import db from "../../../database/models";

import * as STATUS_CODE from "../../../constants/status_code";
import jsonResponse from "../../../helpers/jsonResponse";
import Token, {TokenPayload} from "../../../helpers/token";
import sendEmail from "../../../helpers/sendEmail";

const { User, ForexBureau, Token: TokenModel, OTP } = db;
const accesSecretKey = process.env.ACCESS_SECRET_KEY as string;

const isProduction = process.env.NODE_ENV === "production" ? true : false;

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

    const opt = await Token.generateOTP(newUser.id);

    if (opt) {
      await sendEmail({
        email: newUser.email,
        subject: "Mago - Verify your email",
        title: locales('welcome', lang as string),
        body: locales('verificationOtpMessage', lang as string),
        code: opt,
        lang: lang as string,
      });
    }

    return jsonResponse({
      res,
      status: STATUS_CODE.CREATED,
      message: locales('createdSuccessfully', lang as string),
      data: newUser,
    });
  } catch (error: any) {
    // await transaction.rollback();
    return jsonResponse({
      res,
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { lang = 'en' } = req.headers;
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email },
      attributes: { include: ['password'] }
    });
  
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return jsonResponse({
        res,
        status: STATUS_CODE.UNAUTHORIZED,
        message: locales('InvalidCredentials', lang as string),
      });
    }

    if (!user.is_account_active) {
      return jsonResponse({
        res,
        status: STATUS_CODE.FORBIDDEN,
        message: locales('forbiddenAccess', lang as string),
      });
    }

    let include = [] as any;
    
    if (user.account_type === "forex_bureau") {
      include = [
        {
          model: ForexBureau,
          as: "forex_bureau",
          attributes: ["id", "bureau_name", "bureau_email", "bureau_phone_number", "country"],
          where: { user_id: user.id },
        },
      ];
    }
    
    user = await User.findOne({ where: { email }, include });
    const {password: _, ...userData} = user.get({ plain: true })
    const userAgent = userAgents.parse(req.headers["user-agent"] || "");

    if (user.last_login) {
      user.last_login = luxon.DateTime.utc().toJSDate();
      await user.save();
    }
    const token = await Token.generateToken(userData, userAgent);

    return jsonResponse({
      res,
      status: STATUS_CODE.OK,
      message: locales('loggedInSuccessfully', lang as string),
      data: { user: userData, token },
    });
  } catch (error: any) {
    console.log(error)
    return jsonResponse({
      res,
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  const { lang = 'en' } = req.headers;
  const refreshToken = req.headers.authorization?.split("Bearer ")[1];

  Token.verifyRefreshToken(refreshToken as string).then(async (decoded: TokenPayload) => {
    const userToken = await TokenModel.findOne({ where: { user_id: decoded.id, token: refreshToken } });

    if (!userToken) {
      return jsonResponse({
        res,
        status: STATUS_CODE.UNAUTHORIZED,
        message: locales('InvalidCredentials', lang as string),
      });
    }

    await userToken.destroy();

    return jsonResponse({
      res,
      status: STATUS_CODE.OK,
      message: locales('loggedOutSuccessfully', lang as string),
    });
  }).catch((error: any) => {
    return jsonResponse({
      res,
      status: STATUS_CODE.UNAUTHORIZED,
      message: error.message,
    });
  });
};


const refreshToken = async (req: Request, res: Response) => {
  const { lang = 'en' } = req.headers;
  const refresh_token = req.body.refresh_token;

  const userAgent = userAgents.parse(req.headers["user-agent"] || "");

  Token.verifyRefreshToken(refresh_token).then(async (decoded: TokenPayload) => {
    const payload: TokenPayload = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      isVerified: decoded.isVerified,
      accountType: decoded.accountType,
      country: decoded.country,
      os: userAgent.os,
      browser: userAgent.browser,
      device: userAgent.source,
      isMobile: userAgent.isMobile,
    };

    if (decoded.accountType === "forex_bureau") {
      payload.isForexVerified = decoded.isForexVerified;
      payload.isForexAccountActive = decoded.isForexAccountActive;
    }

    const accessToken = await jwt.sign(payload, accesSecretKey, { expiresIn: "1d" });

    return jsonResponse({
      res,
      status: STATUS_CODE.OK,
      message: locales('loggedInSuccessfully', lang as string),
      data: { accessToken },
    });

  }).catch((error: any) => {
    return jsonResponse({
      res,
      status: STATUS_CODE.UNAUTHORIZED,
      message: error.message,
    });
  });
};

export default {
  register,
  login,
  refreshToken,
  logout,
}