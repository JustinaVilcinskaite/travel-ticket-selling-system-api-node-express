import Joi from "joi";

export default Joi.object({
  title: Joi.string().required(),
  ticketPrice: Joi.number().required(),
  fromLocation: Joi.string().required(),
  toLocation: Joi.string().required(),
  toLocationPhotoUrl: Joi.string().required().uri().messages({
    "string.uri": 'The "toLocationPhotoUrl" must be a valid URL.',
  }),
  userId: Joi.string().required(),
});
