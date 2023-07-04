import { Module } from '@nestjs/common';
import { MalteseService } from './maltese.service';
import { MalteseController } from './maltese.controller';
import { DogModule } from 'src/dog/dog.module';

@Module({
  imports: [DogModule],
  controllers: [MalteseController],
  providers: [MalteseService],
})
export class MalteseModule {}
