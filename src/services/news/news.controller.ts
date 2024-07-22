import { JwtAuthGuard } from '@/services/auth/jwt-auth.guard';
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
import { UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('api/v1/news')
@ApiBearerAuth('accessToken')
@ApiBearerAuth('refreshToken')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.newsService.create(createNewsDto, file, req.user);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'orderBy', type: String, required: false })
  @ApiQuery({ name: 'filter', type: String, required: false })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(16), ParseIntPipe) limit: number = 16,
    @Query('orderBy') orderBy?: string,
    @Query('filter') filter?: string
  ): Promise<Pagination<News>> {
    limit = limit > 100 ? 100 : limit;
    return await this.newsService.getAll(
      {
        page,
        limit,
        route: '/api/v1/products'
      },
      orderBy,
      filter
    );
  }

  @Get('/recently')
  findRecent(@Query('take') take: number = 5) {
    return this.newsService.findRecently(take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.newsService.update(id, updateNewsDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
