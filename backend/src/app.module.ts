import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ProjectModule } from './modules/project/project.module';
import { TagModule } from './modules/tag/tag.module';
import { SkillModule } from './modules/skill/skill.module';
import { UploadModule } from './modules/upload/upload.module';
import { PostModule } from './modules/post/post.module';

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
        SUPABASE_PUBLIC_KEY: Joi.string().required(),
        SUPABASE_SECRET_KEY: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        POSTHOG_API_KEY: Joi.string().required(),
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
    AnalyticsModule,
    ProjectModule,
    TagModule,
    SkillModule,
    UploadModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
