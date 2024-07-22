import { IsNumber, IsString } from 'class-validator';

export class ProductDTO {
  // @ApiProperty({
  //   type: 'file',
  //   properties: {
  //     file: {
  //       type: 'string',
  //       format: 'binary',
  //     },
  //   },
  // })
  // file: any;

  // @ApiProperty({
  //   type: 'file',
  //   properties: {
  //     file: {
  //       type: 'string',
  //       format: 'binary',
  //     },
  //   },
  // })

  // @ApiProperty({ description: 'name' })
  @IsString()
  name: string;

  slug?: string;

  @IsNumber()
  status: number;

  // @ApiProperty({
  //   description: 'product img',
  //   type: 'array',
  //   items: { type: 'string', format: 'binary' },
  // })
  productImages: string;

  // @ApiProperty({ description: 'mo ta ngan gon' })
  @IsString()
  summary: string;

  // @ApiProperty({ description: 'gia' })
  @IsNumber()
  price: number;

  // @ApiProperty({ description: 'mo ta chi tiet' })
  @IsString()
  description: string;

  // @ApiProperty({
  //   description: 'anh trong mo ta',
  //   type: 'array',
  //   items: { type: 'string', format: 'binary' },
  // })
  descriptionImages: string;
  // pdf file
  // @ApiProperty({ description: 'file mo ta(pdf)' })
  catalogue: string;

  // @ApiProperty({ description: 'thong so ky thuat' })
  @IsString()
  specs: string;

  // @ApiProperty({
  //   description: 'anh trong thong so ky thuat',
  //   type: 'array',
  //   items: { type: 'string', format: 'binary' },
  // })

  specsImages: string;

  // @ApiProperty({ description: 'chi tiet mo ta' })
  @IsString()
  detailsDescription: string;

  // @ApiProperty({ description: 'category' })
  @IsString()
  categorySlug: string;

  // @ApiProperty({ description: 'type' })
  @IsString()
  type: string;
}
