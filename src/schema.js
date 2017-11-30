import Joi from 'joi-browser';
import dynogels from 'dynogels-promisified';

const User = Joi.object({
  id: Joi.string(),
  email: Joi.string().email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  uuid: dynogels.types.uuid(),
});

export default User;
