import { registerAs } from '@nestjs/config';

export default registerAs('calendly', () => ({
  layusApiToken: process.env.LAYUS_PETSHOP_API_TOKEN,
  drPasoApiToken: process.env.DRPASO_PETSHOP_API_TOKEN,
  alfredoApiToken: process.env.ALFREDO_PETSHOP_API_TOKEN,
}));