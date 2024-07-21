import { LogServices } from '../log4js/log4js.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateServiceDTO } from './dto/create-services.dto';
import { Service } from './entities/services.entity';
import { UpdateServiceDTO } from './dto/update-sercices.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private sRepository: Repository<Service>
  ) {}
  private logging = new LogServices();

  async create(
    createBannerDto: CreateServiceDTO,
    file: Express.Multer.File,
    user: User
  ) {
    try {
      if (user.role == 'admin') {
        let saveBanner = Object.assign(new Service(), createBannerDto);

        saveBanner.image = JSON.stringify(file.path.replace('\\', '/'));

        return this.sRepository.save(saveBanner);
      }
      this.logging.getLogger('warning').warn('Unauthorize access: ' + user);

      throw new UnauthorizedException();
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.sRepository.find({
      order: {
        order: 'ASC'
      }
    });
  }

  async findOne(id: string): Promise<Service | null> {
    const banner = await this.sRepository.findOne({ where: { id: id } });

    return banner;
  }

  async update(
    id: string,
    updateBannerDto: UpdateServiceDTO,
    file: Express.Multer.File
  ) {
    const banner = await this.sRepository.findOne({ where: { id: id } });
    if (banner) {
      if (file)
        updateBannerDto.image = JSON.stringify(file.path.replace('\\', '/'));
      return await this.sRepository.save({
        ...banner,
        ...updateBannerDto
      });
    }
    throw new NotFoundException();
  }

  async remove(id: string) {
    const res = await this.sRepository.delete(id);
    if (res.affected) return 'ok';
  }
}
