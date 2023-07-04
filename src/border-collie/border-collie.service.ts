import { Injectable } from '@nestjs/common';

/**
 * [서비스 프로바이더 분리]
 * 권장사항: 서로 다른 모듈에서 사용하는 서비스 프로바이더를 분리하여 각 모듈의 역할과 책임을 명확히.
 */
@Injectable()
export class BorderCollieService {
  playFrisbee() {
    return '원반 물어오기';
  }
}
