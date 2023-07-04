import { Module } from '@nestjs/common';
import { BorderCollieController } from './border-collie.controller';
import { DogModule } from 'src/dog/dog.module';
import { BorderCollieService } from './border-collie.service';

@Module({
  imports: [DogModule],
  controllers: [BorderCollieController],
  providers: [BorderCollieService],
})
export class BorderCollieModule {}
