import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'appraise',
      database: 'appraise_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}