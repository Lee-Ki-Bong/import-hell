import { Module, Type } from '@nestjs/common';
import { MixedDogController } from './mixed-dog.controller';

@Module({})
export class MixedDogModule {
  static forRoot(injectableArr: Type<any>[]) {
    const providers = [
      ...injectableArr.map((injectable) => ({
        provide: injectable,
        useClass: injectable,
      })),
    ];

    return {
      module: MixedDogModule,
      providers,
      controllers: [MixedDogController],
    };
  }
}
