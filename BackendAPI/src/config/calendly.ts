import { registerAs } from '@nestjs/config';

export default registerAs('calendly', () => ({
  apiToken: process.env.CALENDLY_API_TOKEN,
}));