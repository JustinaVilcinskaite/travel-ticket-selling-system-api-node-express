import Joi from "joi";
import { passwordContainsNumberRegex } from "../utils/regex.js";

export default Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(passwordContainsNumberRegex)
    .required()
    .messages({
      "string.pattern.base": "Password must contain at least one number",
    }),
});
