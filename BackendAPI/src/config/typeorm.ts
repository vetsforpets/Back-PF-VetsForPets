import { DataSource, DataSourceOptions } from "typeorm";
import { config as dotenvConfig } from 'dotenv'
import { registerAs } from "@nestjs/config";

dotenvConfig({ path: '.env' })


const config = {
    type: 'postgres',
    database: 'vetsforpets_db',
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    username: 'postgres',
    password: 'admin',
    // url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts, .js}'],
    migrations: ['dist/migrations/*{.ts, .js}'],
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    dropSchema: false,
    // ssl: {
    //     rejectUnauthorized: false,
    // }
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions)
