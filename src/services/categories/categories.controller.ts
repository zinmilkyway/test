import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags
} from '@nestjs/swagger/dist';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiMultiFile } from '@/utils/multiFiles.swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/caterogies')
@ApiTags('categories')
@ApiBearerAuth('accessToken')
@ApiBearerAuth('refreshToken')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('bannerImages')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string'
        },
        summary: {
          type: 'string',
          format: 'string'
        },
        description: {
          type: 'string',
          format: 'string'
        },
        bannerImages: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'bannerImages', maxCount: 5 }])
  )
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles() bannerImages: Array<Express.Multer.File>
  ) {
    return this.categoriesService.create(createCategoryDto, bannerImages);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
