import { Mail } from './entities/mail.entity';
import { Contact } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Mail]),
    // MulterModule.register(multerOptions),
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
