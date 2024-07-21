import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
  constructor(private readonly validValues: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { data } = metadata;
    const isValidValue = this.validValues.includes(value);

    if (!isValidValue) {
      throw new BadRequestException(
        `Invalid ${data} value. It must be one of: ${this.validValues.join(', ')}`
      );
    }

    return value;
  }
}
