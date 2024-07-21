import { Global, Module } from '@nestjs/common';
import { LogServices } from './log4js.service';

@Global()
@Module({ providers: [LogServices], exports: [LogServices] })
export class LoggingModule {}
