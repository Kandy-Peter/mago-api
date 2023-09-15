import { stat } from 'fs';
import jwt from 'jsonwebtoken';
import TokenModel from '../../../database/models';
import OTP from '../../../database/models';
import { nanoid } from 'nanoid';

export const accesSecretKey = process.env.ACCESS_SECRET_KEY as string;
export const refreshSecretKey = process.env.REFRESH_SECRET_KEY as string;

interface TokenPayload {
  id: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
  accountType: string;
  publicId: string;
  country: string;
  isSubscribed: boolean;
  isForexVerified?: boolean;
  isForexAccountActive?: boolean;
}

class Token {
  static async generateToken(user: any, expiresIn: string = '7d') {
    try {
      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
        isActive: user.is_active,
        accountType: user.account_type,
        publicId: user.public_id,
        country: user.country,
        isSubscribed: user.isSubscribed
      };

      if (user.account_type === 'forex_bureau') {
        tokenPayload.isForexVerified = user.is_forex_verified;
        tokenPayload.isForexAccountActive = user.is_forex_account_active;
      }

      const refreshToken = jwt.sign(tokenPayload, refreshSecretKey, { expiresIn: '30d' });

      const accessToken = jwt.sign(tokenPayload, accesSecretKey, { expiresIn: '1h' });

      const userToken = await TokenModel.findOne({ where: { user_id: user.id } });

      if (userToken) {
        await userToken.update({ refresh_token: refreshToken });
      }

      await TokenModel.create({ user_id: user.id, token: refreshToken });
      return Promise.resolve({ accessToken, refreshToken });
    } catch (error) {
      throw Promise.reject(error);
    }
  }

  static async verifyToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, refreshSecretKey) as TokenPayload;
      const userToken = await TokenModel.findOne({ where: { user_id: decoded.id, token: refreshToken } });
      if (!userToken) {
        throw new Error('Invalid token');
      }
      return Promise.resolve(decoded);
    } catch (error) {
      throw Promise.reject(error);
    }
  }

  static async generateOTP(user: any) {
    try {
      const otp = nanoid(5);
      const newOTP = await OTP.create({ user_id: user.id, otp });
      return Promise.resolve(newOTP);
    } catch (error) {
      throw Promise.reject(error);
    }
  }
}

export default Token;