import { Response } from "express";
import { ServerResponse } from "http";
import { SERVER_ERROR } from '../constants/status_code';
/**
 * @param {Object} data
 * @return {ServerResponse} Response
 */
const jsonResponse = (data: { status: number; res: Response; message: string; data?: any }): ServerResponse => {
  const response_status = data.status || SERVER_ERROR;
  return data.res.status(response_status).json({
    response_status,
    ...data,
    res: undefined,
  });
};

export default jsonResponse;
