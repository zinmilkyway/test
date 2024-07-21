import { IsNumber, IsString } from 'class-validator';
export class CreateBannerDto {
  @IsString()
  name: string;
  @IsNumber()
  status: number;
  @IsString()
  title: string;
  @IsString()
  order: number;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  details: string;
}
