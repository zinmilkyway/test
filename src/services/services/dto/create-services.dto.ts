import { IsNumber, IsString } from 'class-validator';
export class CreateServiceDTO {
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
