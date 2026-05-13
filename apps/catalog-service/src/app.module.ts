import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShadersModule } from './shaders/shaders.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongo1:27017,mongo2:27018,mongo3:27019/shteam_catalog?replicaSet=rs0',
      {
        readPreference: 'primaryPreferred',
        serverSelectionTimeoutMS: 5000,
      }
    ),
    ShadersModule,
  ],
  controllers: [AppController],
  providers: [],

})
export class AppModule { }