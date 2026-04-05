import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user/user.module";
import { appConfig, databaseConfig, corsConfig } from "./config";
import { validateEnv } from "./config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      validate: validateEnv,
      load: [appConfig, databaseConfig, corsConfig],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("database.host", "localhost"),
        port: configService.get("database.port", 3306),
        username: configService.get("database.username", "root"),
        password: configService.get("database.password", ""),
        database: configService.get("database.database", "turing_lab"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("app.nodeEnv") !== "production",
        logging: configService.get("app.nodeEnv") === "development",
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function getEnvFilePath(): string {
  const env = process.env.NODE_ENV || "development";
  const envFiles = {
    development: ".env.development",
    test: ".env.test",
    production: ".env.production",
  };
  return envFiles[env as keyof typeof envFiles] || ".env.development";
}
