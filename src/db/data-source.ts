import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysqlContainer', // "127.0.0.1",
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'subscribers',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
  migrationsRun: true,
  logging: ['error'],
  synchronize: false,
});
