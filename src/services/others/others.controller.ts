import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './dto/menu.dto';
import { ApiTags } from '@nestjs/swagger/dist';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OthersService } from './others.service';

@Controller('api/v1/others')
@ApiTags('others')
export class OthersController {
  constructor(private readonly othersService: OthersService) {}

  @Post('/menu')
  create(@Body() menuDto: Menu) {
    return this.othersService.create(menuDto);
  }

  @Get('/menu')
  findAll() {
    return this.othersService.findAll();
  }

  @Get('/menu/:id')
  findOne(@Param('id') id: string) {
    return this.othersService.findOne(+id);
  }
  //   @Get(':id')
  // findOne(@Param('id') id: string): string {
  //   return `This action returns a #${id} cat`;
  // }

  @Patch('/menu/:id')
  update(@Param('id') id: string, @Body() menuDto: UpdateMenuDto) {
    return this.othersService.update(+id, menuDto);
  }

  @Delete('/menu/:id')
  remove(@Param('id') id: string) {
    return this.othersService.remove(+id);
  }
}
