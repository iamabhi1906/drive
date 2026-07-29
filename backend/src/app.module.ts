import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './database/config/orm.config';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.validation';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    //   serveRoot: '/app',
    // }),
    TypeOrmModule.forRootAsync(ormConfig),
    UsersModule,
    AuthModule,
    EmailVerificationModule,
    MailModule,
    FileModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
