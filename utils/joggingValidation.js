const Joi = require('joi');
const httpErrors = require('http-errors');

exports.validInputs = async (body, next) => {
  const jogging = Joi.object({
    distance: Joi.number().min(500).max(5000).required(),
    time: {
      hours: Joi.number().required().less(new Date().getHours()),
      minutes: Joi.number().required(),
      seconds: Joi.number().required(),
    },
  });

  if (!Array.isArray(body)) {
    const { distance, time } = body;
    const isValid = await jogging.validate({ distance, time });
    if (isValid.error)
      return next(new httpErrors(400, `${isValid.error.message}`));
  } else {
    for (let i = 0; i < body.length; i++) {
      const distance = body[i].distance;
      const time = body[i].time;
      const id = body[i].id;

      const isValid = await jogging.validate({ distance, time });
      if (isValid.error)
        return next(new httpErrors(400, `${isValid.error.message}`));

      const schema = Joi.object({ id: Joi.number().required().id() });
      const isValidId = await schema.validate({ id });
      if (isValidId.error)
        return next(new httpErrors(400, isValidId.error.message));
    }
  }
};
