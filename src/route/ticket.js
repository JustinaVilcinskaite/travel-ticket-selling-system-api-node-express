import express from "express";

import { BUY_TICKET } from "../controller/ticket.js";

import authUser from "../middleware/authentication.js";
import validate from "../middleware/validation.js";
import ticketSchema from "../schema/ticket.js";

const router = express.Router();

router.post("/tickets", authUser, validate(ticketSchema), BUY_TICKET);

export default router;
