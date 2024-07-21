import { Menu } from './dto/menu.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OthersService } from './others.service';
import { OthersController } from './others.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu]),
    // MulterModule.register(multerOptions),
  ],
  controllers: [OthersController],
  providers: [OthersService]
})
export class OthersModule {}
