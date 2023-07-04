import { Controller, Get } from '@nestjs/common';
import { DogService } from 'src/dog/dog.service';
import { BorderCollieService } from './border-collie.service';

@Controller('border-collie')
export class BorderCollieController {
  constructor(
    private readonly borderCollieService: BorderCollieService,
    private readonly dogService: DogService,
  ) {}

  @Get('bark')
  bark() {
    return this.dogService.bark();
  }

  @Get('playFrisbee')
  playFrisbee() {
    return this.borderCollieService.playFrisbee();
  }
}
