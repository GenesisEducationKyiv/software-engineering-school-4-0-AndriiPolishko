import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  migrationsRun: true,
  logging: ['error'],
  synchronize: false,
});
