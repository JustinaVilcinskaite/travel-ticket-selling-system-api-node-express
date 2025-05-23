import Joi from "joi";
import { passwordContainsNumberRegex } from "../utils/regex.js";

export default Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .pattern(passwordContainsNumberRegex)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one number",
    }),
  moneyBalance: Joi.number().required(),
});


