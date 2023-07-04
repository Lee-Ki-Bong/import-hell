import { Module, Type } from '@nestjs/common';
import { MixedDogController } from './mixed-dog.controller';

/**
 * [다이나믹 모듈을 이용한 방법]
 * 필요한 상황 : 상황에 따라 동적으로 외부 프로바이더들을 사용해야할 경우
 *        ex) 우리는 그동안TypeOrmModule에 동적으로 사용할 엔티티를 등록하여 사용했었다.
 * 권장사항: 불필요한 복잡성을 증가시키지 않기 위해 동적 모듈은 필요한 경우에만 사용
 *  - 복잡성증가, 성능저하, 디버깅과 유지보수 어려움
 */

@Module({})
export class MixedDogModule {
  static forRoot(injectables: Type<any>[]) {
    const providers = [
      ...injectables.map((injectable) => ({
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
