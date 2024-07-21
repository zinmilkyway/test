import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: 'ecommerce.sqlite3',
        // host: configService.getOrThrow('SQL_HOST'),
        // port: configService.getOrThrow('SQL_PORT'),
        // database: configService.getOrThrow('SQL_DATABASE'),
        // username: configService.getOrThrow('SQL_USERNAME'),
        // password: configService.getOrThrow('SQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('SQL_SYNCHRONIZE') ?? true,
        cache: {
          duration: 30 * 60000
        }
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}
