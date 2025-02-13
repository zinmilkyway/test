import { UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger/dist';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UseGuards,
  Request,
  DefaultValuePipe,
  ParseIntPipe
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { News } from './entities/news.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '@/services/auth/jwt-auth.guard';

@ApiTags('news')
@Controller('api/v1/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    return this.newsService.create(createNewsDto, file, req.user);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(16), ParseIntPipe) limit: number = 16,
    @Query('orderBy') orderBy: string = 'created_at',
    @Query('filter') filter: string = '1,2'
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
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.newsService.update(+id, updateNewsDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
