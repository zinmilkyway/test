import { Contact } from './entities/contact.entity';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {}
  create(createContactDto: CreateContactDto) {
    createContactDto.address = JSON.stringify(createContactDto.address);
    createContactDto.phone = JSON.stringify(createContactDto.phone);
    createContactDto.work_time = JSON.stringify(createContactDto.work_time);
    return this.contactRepo.save(createContactDto);
  }

  async findAll() {
    const contact = await this.contactRepo.find();
    if (!contact) throw new NotFoundException();
    console.log(contact);
    contact.forEach((element, id) => {
      contact[id].address = JSON.parse(element.address);
      contact[id].phone = JSON.parse(element.phone);
      contact[id].work_time = JSON.parse(element.work_time);
    });
    return contact;
  }

  async findOne() {
    const contact = await this.contactRepo.findOne({
      where: {
        id: 1,
      },
      cache: false,
    });
    if (!contact) throw new NotFoundException();
    contact.address = JSON.parse(contact.address);
    contact.phone = JSON.parse(contact.phone);
    contact.work_time = JSON.parse(contact.work_time);
    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const oldContact = await this.contactRepo.find({
      where: {
        id: 1,
      },
      cache: false,
    });
    if (!oldContact) throw new NotFoundException();
    updateContactDto.address = JSON.stringify(updateContactDto.address);
    updateContactDto.phone = JSON.stringify(updateContactDto.phone);
    updateContactDto.work_time = JSON.stringify(updateContactDto.work_time);
    return this.contactRepo.save({
      ...oldContact,
      ...updateContactDto,
    });
  }

  remove(id: number) {
    return this.contactRepo.delete(id);
  }
}
