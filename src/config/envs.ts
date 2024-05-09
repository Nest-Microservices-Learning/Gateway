import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  NATS_URL: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_URL: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_URL: process.env.NATS_URL?.split(','),
});

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  NATS_URL: envVars.NATS_URL,
};
