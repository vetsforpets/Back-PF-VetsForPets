import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv'
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env' })


const config = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts, .js}'],
    migrations: ['dist/migrations/*{.ts, .js}'],
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    dropSchema: false,
    ssl: {
        rejectUnauthorized: false,
    }

}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions)
