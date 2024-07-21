import { PartialType } from '@nestjs/mapped-types';
import { Menu } from './menu.dto';

export class UpdateMenuDto extends PartialType(Menu) {}
