import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { SagaService } from './saga/saga.service';
import { ProcessedOrder } from './saga/processed-order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'shteam_user',
      password: 'shteam_password',
      database: 'identity_db',
      entities: [User, ProcessedOrder],
      synchronize: process.env.TYPEORM_SYNC !== 'false',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [SagaService],
})
export class AppModule {}
