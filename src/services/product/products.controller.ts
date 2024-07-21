import { ApiMultiFile } from '@/utils/multiFiles.swagger';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UploadedFiles } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { DeleteResult } from 'typeorm';
import { EnumValidationPipe } from '../baseServices/validation/EnumValidationPipe';
import { ProductDTO } from './dto/product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags('products')
@Controller('api/v1/products')
@ApiBearerAuth('accessToken')
@ApiBearerAuth('refreshToken')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiResponse({ type: ProductDTO })
  async GetAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(16), ParseIntPipe) limit: number = 16,
    @Query(
      'orderBy',
      new DefaultValuePipe('ASC'),
      new EnumValidationPipe(['ASC', 'DESC'])
    )
    orderBy?: 'ASC' | 'DESC',
    @Query('filter') filter?: string
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return await this.productsService.getAll(
      {
        page,
        limit,
        route: '/api/v1/products'
      },
      orderBy,
      filter
    );
  }

  @Get('/:categoryId')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  @ApiQuery({ name: 'filter', type: String, required: false })
  @ApiResponse({ type: ProductDTO })
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(16), ParseIntPipe) limit: number = 16,
    @Query(
      'orderBy',
      new DefaultValuePipe('ASC'),
      new EnumValidationPipe(['ASC', 'DESC'])
    )
    orderBy?: 'ASC' | 'DESC',
    @Query('filter') filter?: string
  ): Promise<Pagination<Product>> {
    limit = limit > 100 ? 100 : limit;
    return await this.productsService.getAll(
      {
        page,
        limit,
        route: '/api/v1/products'
      },
      orderBy,
      filter,
      categoryId
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('productImages')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string'
        },
        productImages: {
          type: 'string',
          format: 'binary'
        },
        summary: {
          type: 'string',
          format: 'string'
        },
        price: {
          type: 'string',
          format: 'string'
        },
        description: {
          type: 'string',
          format: 'string'
        },
        descriptionImages: {
          type: 'string',
          format: 'binary'
        },
        catalogue: {
          type: 'string',
          format: 'binary'
        },
        specs: {
          type: 'string',
          format: 'string'
        },
        specsImages: {
          type: 'string',
          format: 'binary'
        },
        detailsDescription: {
          type: 'string',
          format: 'string'
        },
        categoryId: {
          type: 'string',
          format: 'string'
        },
        type: {
          type: 'string',
          format: 'string'
        }
      }
    }
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'productImages', maxCount: 15 },
      { name: 'descriptionImages', maxCount: 15 },
      { name: 'specsImages', maxCount: 15 },
      { name: 'catalogue', maxCount: 5 }
    ])
  )
  async Create(
    @Request() req,
    @Body() product: ProductDTO,
    // @UploadedFiles() specsImages: Array<Express.Multer.File>,
    // @UploadedFiles() descriptionImages: Array<Express.Multer.File>,
    @UploadedFiles()
    files: {
      productImages?: Express.Multer.File[];
      descriptionImages?: Express.Multer.File[];
      specsImages?: Express.Multer.File[];
      catalogue?: Express.Multer.File[];
    }
  ) {
    return await this.productsService.create(
      product,
      files,
      req.body.related,
      req.user
    );
  }

  @Get('get-one/:id')
  @ApiParam({ name: 'id', type: String })
  async GetOne(@Param('id') productId: string) {
    console.log(productId);
    return await this.productsService.getOne(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('get-one/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'productImages', maxCount: 5 }])
  )
  async Update(
    @Param() id: any,
    @Body() product: ProductDTO,
    @UploadedFiles()
    files: {
      productImages?: Express.Multer.File[];
    },
    @Request() req
  ): Promise<Product> {
    return await this.productsService.update(
      id.id,
      product,
      req.body.related,
      files,
      req.user
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete('get-one/:id')
  async Delete(@Param() id: number, @Request() req): Promise<DeleteResult> {
    return await this.productsService.delete(id, req.user);
  }
}
