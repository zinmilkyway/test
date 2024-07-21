import { filter } from 'rxjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { User } from 'src/services/auth/entities/user.entity';
import { removeVietnameseTones } from 'src/utils/fn';
import { DeleteResult, Repository } from 'typeorm';
import { LogServices } from './../log4js/log4js.service';
import { ProductDTO } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { RelatedProduct } from './entities/relatedProduct.entity';
import { Category } from '../categories/entities/category.entity';

export enum Order {}
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(RelatedProduct)
    private relatedProducts: Repository<RelatedProduct>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>
  ) {}

  private logging = new LogServices();

  async getAll(
    options: IPaginationOptions,
    orderBy?: 'ASC' | 'DESC',
    filter?: string,
    categoryId?: string
  ): Promise<Pagination<Product>> {
    if (filter || categoryId) {
      return this.searchProducts(options, orderBy, filter, categoryId);
    }

    const queryBuilder = this.productRepository
      .createQueryBuilder('prod')
      .where('prod.status= :status', { status: 1 })
      .orderBy('prod.updatedAt', orderBy)
      .cache('product', 30 * 1000);

    const productsPage = await paginate<Product>(queryBuilder, options);

    if (productsPage) {
      productsPage.items.forEach((item) => {
        item.productImages = item.productImages
          ? JSON.parse(item.productImages)
          : [];
        item.catalogue = item.catalogue ? JSON.parse(item.catalogue) : [];
      });
    }
    return productsPage;
  }

  async searchProducts(
    options: IPaginationOptions,
    orderBy?: 'ASC' | 'DESC',
    filter?: string,
    categoryId?: string
  ): Promise<Pagination<Product>> {
    // provide builder to paginate
    const queryBuilder = this.productRepository
      .createQueryBuilder('prod')
      .where('prod.status = :status', { status: 1 });

    if (filter) {
      const slug = removeVietnameseTones(filter ?? '');
      queryBuilder.andWhere('prod.slug like :slug', { slug: `%${slug}%` });
    }
    if (categoryId) {
      queryBuilder
        .leftJoinAndSelect('prod.category', 'category')
        .andWhere('category.slug = :categoryId', {
          categoryId: categoryId
        });
    }
    queryBuilder.orderBy('prod.updatedAt', orderBy).cache('product', 30 * 1000);

    const productsPage = await paginate<Product>(queryBuilder, options);

    if (productsPage) {
      productsPage.items.forEach((item) => {
        item.productImages = item.productImages
          ? JSON.parse(item.productImages)
          : [];
        item.catalogue = item.catalogue ? JSON.parse(item.catalogue) : [];
      });
    }
    return productsPage;
  }

  async create(
    productDTO: ProductDTO,
    files: any,
    relatedProduct: string,
    user: User
  ) {
    try {
      if (user.role == 'admin') {
        let saveProduct = Object.assign(new Product(), productDTO);

        const category = await this.categoryRepo.findOne({
          where: {
            slug: productDTO.categoryId
          }
        });
        if (!category) {
          throw new BadRequestException('Category not found');
        } else {
          saveProduct.category = category;
        }

        if (files.productImages) {
          const productImages = {};
          for (const [index, file] of files.productImages.entries()) {
            productImages[index] = file.path.replace('\\', '/');
          }
          saveProduct.productImages = JSON.stringify(productImages);
        }

        if (files.descriptionImages) {
          const descriptionImages = {};
          for (const [index, file] of files.descriptionImages.entries()) {
            descriptionImages[index] = file.path.replace('\\', '/');
          }
          saveProduct.descriptionImages = JSON.stringify(descriptionImages);
        }

        if (files.specsImages) {
          const specsImages = {};
          for (const [index, file] of files.specsImages.entries()) {
            specsImages[index] = file.path.replace('\\', '/');
          }
          saveProduct.specsImages = JSON.stringify(specsImages);
        }
        if (files.catalogue) {
          const catalogue = {};
          for (const [index, file] of files.catalogue.entries()) {
            catalogue[index] = file.path.replace('\\', '/');
          }
          saveProduct.catalogue = JSON.stringify(catalogue);
        }

        if (relatedProduct) {
          saveProduct.related = [];
          const relatedPro = new Set(JSON.parse(relatedProduct)) as Set<string>;
          // TODO: switch to select in() and create related after that
          for (const id of relatedPro) {
            const data = await this.productRepository.findOne({
              where: { id: id }
            });

            if (data) {
              const related = new RelatedProduct();
              related.productId = id;
              related.images = data.productImages;
              related.name = data.name;
              this.relatedProducts.save(related);
              saveProduct.related.push(related);
            }
          }
        }
        saveProduct.slug = removeVietnameseTones(productDTO.name);
        const res = await this.productRepository.manager.save(saveProduct);
        return res;
      }
      this.logging
        .getLogger('warning')
        .warn('Unauthorize access: ' + JSON.stringify(user));
    } catch (error) {
      if (error.status === 401) throw new UnauthorizedException();
      throw new ServiceUnavailableException();
    }
  }

  async getOne(productId: string) {
    const data = await this.productRepository.findOne({
      where: { id: productId },
      relations: {
        related: true,
        category: true
      },
      cache: false
    });

    if (data) {
      data.productImages = JSON.parse(data.productImages);
      if (data.related.length) {
        data.related.forEach((element, idx) => {
          data.related[idx].images = JSON.parse(element.images);
        });
      }
      if (data.catalogue) {
        data.catalogue = JSON.parse(data.catalogue);
      }

      return data;
    }
    throw new NotFoundException();
  }

  async update(
    id: string,
    productDTO: ProductDTO,
    relatedProduct: string | null,
    files: any,
    user: User
  ): Promise<Product> {
    try {
      if (user.role == 'admin') {
        let saveProduct = Object.assign(new Product(), productDTO);

        const product = await this.productRepository.findOne({
          where: { id: id },
          relations: {
            related: true
          }
        });

        if (files.productImages) {
          const productImages = {};
          for (const [index, file] of files.productImages.entries()) {
            productImages[index] = file.path.replace('\\', '/');
          }

          saveProduct.productImages = JSON.stringify(productImages);
        }
        if (!!relatedProduct) {
          // saveProduct.related = [...product.related];
          saveProduct.related = [];
          const relatedPro = new Set(JSON.parse(relatedProduct)) as Set<string>;
          // TODO: switch to select in() and create related after that
          for (const id of relatedPro) {
            const data = await this.productRepository.findOne({
              where: { id: id }
            });

            if (data) {
              const related = new RelatedProduct();
              related.productId = id;
              related.images = data.productImages;
              related.name = data.name;
              this.relatedProducts.save(related);
              saveProduct.related.push(related);
            }
          }
        }

        return await this.productRepository.save({
          ...product,
          ...saveProduct
        });
      }
      this.logging.getLogger('warning').warn('Unauthorize access: ' + user);
    } catch (error) {
      this.logging.getLogger('debug').debug(error);
      if (error.status === 401) throw new UnauthorizedException();
      throw new ServiceUnavailableException();
    }
  }

  async delete(id: number, user: User): Promise<DeleteResult> {
    try {
      if (user.role == 'admin') {
        return await this.productRepository.delete(id);
      }
    } catch (error) {
      this.logging.getLogger('debug').debug(error);
      if (error.status === 401) {
        this.logging.getLogger('warning').warn('Unauthorize access: ' + user);
        throw new UnauthorizedException();
      }
      throw new ServiceUnavailableException();
    }
  }
}
