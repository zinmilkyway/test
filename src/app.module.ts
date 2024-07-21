import { CategoriesModule } from './services/categories/categories.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { multerOptions } from './config/multer.config';
import { AuthModule } from './services/auth/auth.module';
import { DatabaseModule } from './services/baseServices/database/database.module';
import { BannerModule } from './services/banner/banner.module';
import { CustomersModule } from './services/customers/customers.module';
import { NewsModule } from './services/news/news.module';
import { ProductModule } from './services/product/product.module';
import { OthersModule } from './services/others/others.module';
import { ContactModule } from './services/contact/contact.module';
import { ServicesModule } from './services/services/services.module';
import { CartModule } from './services/cart/cart.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'env',
  auth: {
    user: 'env',
    pass: 'env'
  }
});
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    BannerModule,
    CategoriesModule,
    CustomersModule,
    NewsModule,
    ProductModule,
    OthersModule,
    ContactModule,
    ContactModule,
    ServicesModule,
    CartModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register(multerOptions),
    MailerModule.forRoot({
      transport: transporter,
      defaults: {
        from: ''
      },
      template: {
        dir: process.cwd() + 'services/mailer/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }),

    ServeStaticModule.forRootAsync({
      useFactory: async () => {
        return [
          {
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/' + 'uploads' + '/'
          },
          {
            rootPath: join(__dirname, '..', '../' + 'uploads'),
            serveRoot: '/' + 'uploads' + '/'
          }
        ];
      }
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
