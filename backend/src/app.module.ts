import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string()
          .required()
          .valid('development', 'production', 'test')
          .default('production'),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_ANON_KEY: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory() {
        return {
          type: 'postgres',
          host: 'localhost',
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true,
          // synchronize: process.env.ENVIRONMENT === 'development',
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
