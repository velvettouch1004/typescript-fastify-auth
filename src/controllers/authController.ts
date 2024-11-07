import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import * as Yup from "yup";
import UserModel from "../models/User";
import * as response from "../utils/responses";
import {
  FastifyInstaceWithJWT,
  ISignUpRequest,
  ISignInRequest,
} from "../interfaces/user";
import * as Validator from "../utils/validators";

const loginValidator = Yup.object({
  email: Validator.emailSchema(),
  password: Validator.passwordSchema(),
});

const signUpValidator = Yup.object({
  name: Validator.nameSchema(),
  email: Validator.emailSchema(),
  password: Validator.passwordSchema(),
  update: Validator.updateSchema(),
});

// Login User
export const loginUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { email, password } = (req.body || {}) as ISignInRequest;
  if (!loginValidator.isValidSync({ email, password })) {
    return res.code(400).send({ error: response.INVALID_INPUTS });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res
      .code(401)
      .send({ error: response.EMAIL_OR_PASSWORD_IS_INCORRECT });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .code(401)
      .send({ error: response.EMAIL_OR_PASSWORD_IS_INCORRECT });
  }

  const accessToken = (req.server as FastifyInstaceWithJWT).jwt.sign(
    {
      id: user.id,
    },
    { expiresIn: "1h" }
  );
  const refreshToken = (req.server as FastifyInstaceWithJWT).jwt.sign(
    {
      id: user.id,
    },
    { expiresIn: "1d" }
  );
  return res
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send({
      accessToken,
      detail: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscribed: user.subscribed,
        createdAt: user.createAt,
      },
    });
};

// Register User
export const registerUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { name, email, password, update } = (req.body || {}) as ISignUpRequest;

  if (!signUpValidator.isValidSync({ name, email, password, update })) {
    return res.code(400).send({ error: response.INVALID_INPUTS });
  }

  // Check if the user exists using Mongoose
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.code(400).send({ error: response.DUPLICATED_EMAIL });
  }

  // Hash the password and create a new user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    update,
  });

  try {
    await newUser.save();
    return res.code(201).send({ message: response.SUCCESS_SIGNUP });
  } catch (error) {
    req.log.error(error);
    return res.code(500).send({ error: response.INTERNAL_SERVER_ERROR });
  }
};

// refresh access token from refresh token
export const refreshUser = async (req: FastifyRequest, res: FastifyReply) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.code(401).send({ error: response.UNAUTHORIZED });
  }
  try {
    const decoded = req.server.jwt.verify(refreshToken) as { id: string };
    const accessToken = (req.server as FastifyInstaceWithJWT).jwt.sign(
      {
        id: decoded.id,
      },
      { expiresIn: "1h" }
    );
    const user = await UserModel.findById(decoded.id);
    res.send({
      accessToken,
      detail: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscribed: user.subscribed,
        createdAt: user.createAt,
      },
    });
  } catch (err) {
    req.log.error(err);
    return res.code(401).send({ error: response.UNAUTHORIZED });
  }
};

// signout
export const signout = async (req: FastifyRequest, res: FastifyReply) => {
  res
    .setCookie("refreshToken", "", {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send({ success: true });
};
