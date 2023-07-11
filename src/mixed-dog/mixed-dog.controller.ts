import { Controller, Get } from '@nestjs/common';
import { DogService } from 'src/dog/dog.service';
import { MalteseService } from 'src/maltese/maltese.service';
import { BorderCollieService } from 'src/border-collie/border-collie.service';

@Controller('mixed-dog')
export class MixedDogController {
  constructor(
    private readonly dogService: DogService,
    private readonly malteseService: MalteseService,
    private readonly borderCollieService: BorderCollieService,
  ) {}

  @Get('bark')
  bark() {
    return this.dogService.bark();
  }

  @Get('showingBelly')
  showingBelly() {
    return this.malteseService.showingBelly();
  }

  @Get('playFrisbee')
  playFrisbee() {
    return this.borderCollieService.playFrisbee();
  }
}
