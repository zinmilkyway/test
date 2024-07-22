import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { removeVietnameseTones } from '@/utils/fn';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto, banners: any) {
    try {
      const saveCate = new Category(createCategoryDto);
      saveCate.slug = removeVietnameseTones(createCategoryDto.name);
      const isExist = await this.categoryRepository.findOne({
        where: {
          slug: saveCate.slug
        }
      });

      console.log(isExist);
      if (isExist) {
        throw new BadRequestException('Danh mục đã tồn tại');
      }
      if (banners.bannerImages) {
        const banner = {};
        banners.bannerImages.forEach((file, index) => {
          banner[index] = file.path.replace('\\', '/');
        });
        saveCate.bannerImages = JSON.stringify(banner);
      }
      await this.categoryRepository.save(saveCate);
      return saveCate;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Danh mục đã tồn tại');
    }
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    if (categories) {
      categories.forEach((item) => {
        item.bannerImages = item.bannerImages
          ? JSON.parse(item.bannerImages)
          : [];
      });
    }
    return categories;
  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return this.categoryRepository.delete({ id: id });
  }
}
