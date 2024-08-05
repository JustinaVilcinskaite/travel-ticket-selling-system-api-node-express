import express from "express";

import {
  SIGN_UP,
  LOGIN,
  GET_NEW_JWT_TOKENS,
  DELETE_USER_ACCOUNT_BY_ID,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controller/user.js";

import authUser from "../middleware/authentication.js";
import validate from "../middleware/validation.js";
import userSchema from "../schema/user.js";

// import authorizeUser from "../middleware/authorization.js";

const router = express.Router();

router.post("/users", validate(userSchema), SIGN_UP);
router.post("/login", LOGIN);
router.post("/tokens/refresh", GET_NEW_JWT_TOKENS);

router.get("/users", authUser, GET_ALL_USERS);
router.get("/users/:id", authUser, GET_USER_BY_ID);
router.get("/users/:id/tickets", authUser, GET_USER_BY_ID_WITH_TICKETS);
router.delete("/users/:id", authUser, DELETE_USER_ACCOUNT_BY_ID);

export default router;
