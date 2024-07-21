import { LogServices } from './../log4js/log4js.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { User } from './../auth/entities/user.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>
  ) {}
  private logging = new LogServices();

  async create(
    createBannerDto: CreateBannerDto,
    file: Express.Multer.File,
    user: User
  ) {
    if (user.role == 'admin') {
      let saveBanner = Object.assign(new Banner(), createBannerDto);

      saveBanner.image = JSON.stringify(file.path.replace('\\', '/'));

      return this.bannerRepository.save(saveBanner);
    }
    this.logging.getLogger('warning').warn('Unauthorize access: ' + user);

    throw new UnauthorizedException();
  }

  async findAll() {
    return await this.bannerRepository.find({
      take: 5,
      order: {
        order: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Banner | null> {
    const banner = await this.bannerRepository.findOne({ where: { id: id } });
    return banner;
  }

  async update(
    id: string,
    updateBannerDto: UpdateBannerDto,
    file: Express.Multer.File
  ) {
    const banner = await this.bannerRepository.findOne({ where: { id: id } });
    if (banner) {
      if (file)
        updateBannerDto.image = JSON.stringify(file.path.replace('\\', '/'));
      return await this.bannerRepository.save({
        ...banner,
        ...updateBannerDto
      });
    }
    throw new NotFoundException();
  }

  async remove(id: string) {
    const res = await this.bannerRepository.delete(id);
    if (res.affected) return 'ok';
  }
}
