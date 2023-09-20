import { stat } from "fs";
import jwt from "jsonwebtoken";
import db from "../database/models";
import { Details } from "express-useragent";
import moment from "moment";

const { Token: TokenModel, OTP } = db;

export const accesSecretKey = process.env.ACCESS_SECRET_KEY as string;
export const refreshSecretKey = process.env.REFRESH_SECRET_KEY as string;

export interface TokenPayload {
  id: string;
  email: string;
  isVerified: boolean;
  name: string;
  accountType: string;
  country: string;
  isForexVerified?: boolean;
  isForexAccountActive?: boolean;
  os?: string;
  browser?: string;
  device?: string;
  isMobile?: boolean;
}

class AuthHelper {
  static async generateToken(user: any, userAgent: Details) {
    try {
      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        name: user.full_name,
        isVerified: user.is_verified,
        accountType: user.account_type,
        country: user.country,
        os: userAgent.os,
        browser: userAgent.browser,
        device: userAgent.source,
        isMobile: userAgent.isMobile,
      };

      if (user.account_type === "forex_bureau") {
        tokenPayload.isForexVerified = user.is_forex_verified;
        tokenPayload.isForexAccountActive = user.is_forex_account_active;
      }

      const refreshToken = jwt.sign(tokenPayload, refreshSecretKey, {
        expiresIn: "30d",
      });

      const accessToken = jwt.sign(tokenPayload, accesSecretKey, {
        expiresIn: "1d",
      });

      const userToken = await TokenModel.findOne({
        where: { user_id: user.id },
      });

      if (userToken) {
        await userToken.update({ refresh_token: refreshToken });
      }

      await TokenModel.create({ user_id: user.id, token: refreshToken });
      return Promise.resolve({ accessToken, refreshToken });
    } catch (error) {
      throw Promise.reject(error);
    }
  }

  static async verifyRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        refreshSecretKey
      ) as TokenPayload;

      if (!decoded) {
        return Promise.reject(new Error("Invalid refresh token"));
      }
      const userToken = await TokenModel.findOne({
        where: { user_id: decoded.id, token: refreshToken },
      });
      if (!userToken) {
        return Promise.reject(new Error("Invalid refresh token"));
      }
      return Promise.resolve(decoded);
    } catch (error) {
      throw Promise.reject(error);
    }
  }

  static async generateOTP(id: string, subject: string) {
    try {
      const otp = Math.floor(10000 + Math.random() * 90000);
      const newOTP = await OTP.create({
        user_id: id,
        otp,
        subject,
        expires_at: moment().add(15, "minutes").toDate(),
      });
      return newOTP.otp;
    } catch (error) {
      throw Promise.reject(error);
    }
  }
}

export default AuthHelper;
