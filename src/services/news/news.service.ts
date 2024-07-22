import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepo: Repository<News>
  ) {}
  create(createNewsDto: CreateNewsDto, file: any, user: User) {
    if (user.role == 'admin') {
      if (file) {
        createNewsDto.image_path = JSON.stringify(file.path.replace('\\', '/'));
      }
      createNewsDto.created_by = user.name;
      createNewsDto.created_by = user.name;
      return this.newsRepo.save(createNewsDto);
    }
    throw new UnauthorizedException();
  }

  findAll() {
    return this.newsRepo.find();
  }
  async getAll(
    options: IPaginationOptions,
    orderBy?: string,
    filter?: string
  ): Promise<Pagination<News>> {
    // if (filter) return this.searchProducts(options, orderBy, filter);
    // const orderDirection = orderBy
    //   ? { updatedAt: 'DESC' }
    //   : { updatedAt: 'ASC' };

    // const filterCate = filter?.split(',');
    // provide builder to paginate
    // const queryBuilder = await this.newsRepo
    //   .createQueryBuilder('news')
    //   .getMany()

    // console.log(queryBuilder)
    // .orderBy('news.updated_at', 'DESC');
    // .cache('product', 30 * 1000);

    const newsPage = await paginate<News>(this.newsRepo, options);
    // console.log(newsPage)
    // if (newsPage) {
    //   newsPage?.items?.forEach((item) => {
    //     item.image_path = JSON.parse(item?.image_path);
    //   });
    // }
    return newsPage;
  }
  findRecently(number: number) {
    return this.newsRepo.find({
      take: number,
      order: {
        updated_at: 'DESC'
      }
    });
  }

  findOne(id: string) {
    return this.newsRepo.findOne({
      where: {
        id: id
      }
    });
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, file: any) {
    if (file) {
      updateNewsDto.image_path = file.path;
    }
    const oldData = await this.newsRepo.findOne({
      where: {
        id: id
      },
      cache: false
    });
    if (!oldData) throw new NotFoundException();

    return this.newsRepo.save({ ...oldData, ...updateNewsDto });
  }

  remove(id: string) {
    return this.newsRepo.delete(id);
  }
}
