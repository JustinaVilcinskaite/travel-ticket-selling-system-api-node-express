import { v4 as uuidv4 } from "uuid";
import UserModel from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token-generator.js";

const SIGN_UP = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already regsitered" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new UserModel({
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
      moneyBalance: req.body.moneyBalance,
    });

    await user.save();

    const jwtToken = generateAccessToken(user);
    const jwtRefreshToken = generateRefreshToken(user);

    return res.status(201).json({
      message: "User registered successfully.",
      jwtToken: jwtToken,
      jwtRefreshToken: jwtRefreshToken,
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application." });
  }
};

const LOGIN = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Both email and password are required" });
    }
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        message: "Auth failed: incorrect email or password",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Auth failed: incorrect email or password",
      });
    }

    const jwtToken = generateAccessToken(user);
    const jwtRefreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Login was successfull",
      jwtToken: jwtToken,
      jwtRefreshToken: jwtRefreshToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_NEW_JWT_TOKENS = async (req, res) => {
  try {
    // const jwtRefreshToken = req.body.jwtRefreshToken;
    const jwtRefreshToken = req.headers["x-refresh-token"];
    if (!jwtRefreshToken) {
      return res.status(401).json({
        message: "Auth failed. No refresh token provided",
      });
    }

    const decodedToken = jwt.verify(
      jwtRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await UserModel.findOne({ id: decodedToken.userId });
    if (!user) {
      return res.status(401).json({
        message: "Auth failed: Please log in again.",
      });
    }

    const newJwtToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return res.status(200).json({
      jwtToken: newJwtToken,
      jwtRefreshToken: newRefreshToken,
    });
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Auth failed: Please log in again." });
    }

    return res.status(500).json({ message: "Error in application." });
  }
};

const DELETE_USER_ACCOUNT_BY_ID = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.body.userId;

    if (authenticatedUserId !== requestedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await UserModel.findOne({ id: requestedUserId });

    if (!user)
      return res
        .status(404)
        .json({ message: `User with id ${requestedUserId} does not exist` });

    await UserModel.deleteOne({ id: requestedUserId });

    return res.status(200).json({ message: "Your account has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find()
      .sort({ name: 1 })
      .select("-password");

    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json({ users: users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_USER_BY_ID = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.body.userId;

    if (authenticatedUserId !== requestedUserId) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await UserModel.findOne({ id: requestedUserId }).select(
      "-password"
    );

    if (!user)
      return res
        .status(404)
        .json({ message: `User with id ${requestedUserId} does not exist` });

    return res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.body.userId;

    if (authenticatedUserId !== requestedUserId) {
      return res
        .status(403)
        .json({ message: "You can only access your own data" });
    }

    const userWithTickets = await UserModel.aggregate([
      { $match: { id: requestedUserId } },
      {
        $lookup: {
          from: "tickets",
          localField: "id",
          foreignField: "ownerId",
          as: "tickets",
        },
      },
      {
        $project: {
          id: 1,
          name: 1,
          email: 1,
          moneyBalance: 1,
          boughtTickets: "$tickets",
        },
      },
    ]);

    if (userWithTickets.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ userWithTickets: userWithTickets });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error in application" });
  }
};

export {
  SIGN_UP,
  LOGIN,
  GET_NEW_JWT_TOKENS,
  DELETE_USER_ACCOUNT_BY_ID,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USER_BY_ID_WITH_TICKETS,
};
