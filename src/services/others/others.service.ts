import { InjectRepository } from '@nestjs/typeorm';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './dto/menu.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
@Injectable()
export class OthersService {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
  ) {}
  create(menuDto: Menu) {
    if (menuDto.jsonMenu) menuDto.jsonMenu = JSON.stringify(menuDto.jsonMenu);
    return this.menuRepo.save(menuDto);
  }

  async findAll() {
    return await this.menuRepo.find();
  }

  async findOne(id: number) {
    const menu = await this.menuRepo.findOne({
      where: { id: id },
      cache: true,
      // cache: {
      //   id: 'menu',
      //   milliseconds: 10000,
      // },
    });
    if (!menu) throw new NotFoundException();
    if (!!menu.jsonMenu) menu.jsonMenu = JSON.parse(menu.jsonMenu);
    return menu;
  }

  async update(id: number, menuDto: UpdateMenuDto) {
    if (menuDto.jsonMenu) menuDto.jsonMenu = JSON.stringify(menuDto.jsonMenu);
    const menu = await this.menuRepo.findOne({ where: { id: id } });
    return this.menuRepo.save({ ...menu, ...menuDto });
  }
  async remove(id: number) {
    return (await this.menuRepo.delete(id)).affected > 0;
  }
}
