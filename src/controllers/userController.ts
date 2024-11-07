import { FastifyReply } from "fastify";
import UserModel from "../models/User";
import { FastifyRequestWithUserId } from "../interfaces/user";
import * as response from "../utils/responses";

// get user info
export const getUserInfo = async (
  req: FastifyRequestWithUserId,
  res: FastifyReply
) => {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    return res.code(404).send({ error: response.USER_NOT_FOUND });
  }
  res.send({ userInfo: user });
};
