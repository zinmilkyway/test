import { CategoriesModule } from './services/categories/categories.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { OrderModule } from './services/order/order.module';
import { AuthService } from './services/auth/service/auth.service';
import { SignUpDto } from './services/auth/entities/signUp.dto';
import { GalleryModule } from './services/gallery/Gallery.module';

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
    OrderModule,
    AppModule,
    GalleryModule,
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
export class AppModule implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (adminUsername && adminPassword) {
      const adminUser: SignUpDto = {
        username: adminUsername,
        email: adminUsername,
        name: 'ThanhHD',
        password: adminPassword,
        role: 'admin'
      };

      try {
        await this.authService.signup(adminUser);
      } catch (e) {
        // Handle exception if admin already exists
      }
    } else {
      console.error('Admin username and password must be provided');
    }
  }
}
