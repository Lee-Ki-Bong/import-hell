import { Controller, Get } from '@nestjs/common';
import { MalteseService } from './maltese.service';
import { DogService } from 'src/dog/dog.service';

@Controller('maltese')
export class MalteseController {
  constructor(
    private readonly malteseService: MalteseService,
    private readonly dogService: DogService,
  ) {}

  @Get('bark')
  bark() {
    return this.dogService.bark();
  }

  @Get('shoingBelly')
  shoingBelly() {
    return this.malteseService.shoingBelly();
  }
}
