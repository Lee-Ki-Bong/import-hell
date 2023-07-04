import { Module } from '@nestjs/common';
import { DogService } from './dog.service';

/**
 * [공통 모듈 생성]
 * 권장사항: 공통으로 사용되는 기능을 담은 모듈을 생성하여 코드 중복을 최소화하고 모듈 간의 의존성을 명확하게 관리
 */
@Module({
  providers: [DogService],
  exports: [DogService],
})
export class DogModule {}
