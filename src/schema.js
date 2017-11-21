'use strict';

import joiql from 'joiql';
import Joi from 'Joi';
import dynogels from 'dynogels-promisified';

const User = Joi.object({
  id: Joi.string().email(),
  firstName : Joi.string(),
  lastName : Joi.string(),
  uuid : dynogels.types.uuid(),
});

export { User };