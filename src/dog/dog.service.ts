import { Injectable } from '@nestjs/common';

@Injectable()
export class DogService {
  bark() {
    return '왈!';
  }
}
