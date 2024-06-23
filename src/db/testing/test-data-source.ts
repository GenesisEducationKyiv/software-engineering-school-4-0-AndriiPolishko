import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeORMMySqlTestingModule = (entities?: any[]) =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: entities || ['src/db/entities/*.entity.ts'],
    subscribers: [],
    synchronize: true,
    migrationsRun: true,
    logging: false,
  });
