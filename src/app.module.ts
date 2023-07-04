import { Module } from '@nestjs/common';
import { MalteseModule } from './maltese/maltese.module';
import { BorderCollieModule } from './border-collie/border-collie.module';
import { MixedDogModule } from './mixed-dog/mixed-dog.module';
import { DogService } from './dog/dog.service';
import { MalteseService } from './maltese/maltese.service';
import { BorderCollieService } from './border-collie/border-collie.service';

@Module({
  imports: [
    MalteseModule,
    BorderCollieModule,
    MixedDogModule.forRoot([DogService, MalteseService, BorderCollieService]),
  ],
  providers: [],
})
export class AppModule {}
