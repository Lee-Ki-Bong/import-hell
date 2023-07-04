## 모듈 간의 프로바이더 공유

- 모듈간의 의존성 관리를 보다 효과적으로 처리하기위한 방법들을 제시
- 말티즈모듈과 보더콜리모듈 이 있다고 하자.

```javascript
@Module({
  controllers: [MalteseController],
  providers: [MalteseService],
})
export class MalteseModule {}
```

```javascript
@Module({
  controllers: [BorderCollieController],
  providers: [BorderCollieService],
})
export class BorderCollieModule {}
```

## 1. 공통 모듈 생성을 통한 관리

- 공통으로 사용되는 기능을 담은 모듈 생성
- 코드 중복을 최소화하고 모듈 간의 의존성을 명확하게 관리
- Tree 구조의 모듈이라고 생각하면 되겠다.

```javascript
@Module({
  providers: [DogService],
  exports: [DogService],
})
export class DogModule {}
```

```javascript
@Injectable()
export class DogService {
  bark() {
    return '왈!';
  }
}
```

### 말티즈 & 보더콜리 모듈이 공통모듈을 사용한 모습

```javascript
@Module({
  imports: [DogModule], // 공통 모듈
  controllers: [BorderCollieController],
  providers: [BorderCollieService],
})
export class BorderCollieModule {}
```

```javascript
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
```

```javascript
@Module({
  imports: [DogModule], // 공통 모듈
  controllers: [MalteseController],
  providers: [MalteseService],
})
export class MalteseModule {}
```

```javascript
@Controller('maltese')
export class MalteseController {
  constructor(
    private readonly malteseService: MalteseService,
    private readonly dogService: DogService,
  ) {}

  @Get('bark')
  bark() {
    return this.dogService.bark();
  }

  @Get('shoingBelly')
  shoingBelly() {
    return this.malteseService.shoingBelly();
  }
}
```

## 2.서비스 프로바이더 분리

- 각각 사용하는 고유 기능들을 분리하여 각 모듈의 역할과 책임을 명확히하여 관리하는 것이 중요하다.

```javascript
@Injectable()
export class BorderCollieService {
  playFrisbee() {
    return '원반 물어오기'; // 보더콜리만의 고유 기능
  }
}
```

```javascript
@Injectable()
export class MalteseService {
  shoingBelly() {
    return '배 보여주기'; // 말티즈만의 고유 기능
  }
}
```

## 3.다이나믹 모듈을 이용하여 동적으로 프로바이더를 의존성 주입해주는 방법

- 예시로든 믹스견모듈은 추 후 다른 종과도 믹스가 될 가능성이 높다고 가정하여 작성해보았다.
- 즉, 상황에 따라 동적으로 외부 프로바이더들을 사용해야할 경우이다.
- 필요할때마다 모듈을 전부 import 시켜사용한다면, import 지옥이 펼쳐질 것이다.
- 이럴때 동적모듈을 사용해야할 시점이다.

```javascript
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
```

- 믹스견모듈에서 필요한 강아지 기능들을 주입한 모습.

```javascript
@Module({
  imports: [
    MixedDogModule.forRoot([DogService, MalteseService, BorderCollieService]),
  ],
  providers: [],
})
export class AppModule {}
```

- 믹스견컨트롤러에서 주입받은 기능들을 사용한 모습.

```javascript
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

  @Get('shoingBelly')
  shoingBelly() {
    return this.malteseService.shoingBelly();
  }

  @Get('playFrisbee')
  playFrisbee() {
    return this.borderCollieService.playFrisbee();
  }
}

```

- forRoot()를 사용하여 DogService, MalteseService, BorderCollieService를 등록한 경우, 해당 서비스들은 MixedDogModule 내부에서만 사용 가능하다.
- 이 서비스들은 MixedDogModule 내부에서 자체적으로 관리가 된다.
  - 이 말은 각각 말티즈, 보더콜리 모듈을 믹스견 모듈에서 import하지 않아도 사용이 가능하게 됨을 의미한다.
- 추가로, forRoot() 메서드를 사용하는 MixedDogModule 모듈은 싱글톤으로 관리되며, 모듈 내에서 제공하는 프로바이더(서비스, 컨트롤러 등)는 모듈 전체에서 공유된다.

  - 혼합견서비스든 혼합견컨트롤러에서든 등록한 프로바이더들을 의존성 주입하여 사용할 수 있게 된다는 뜻이다.

- **[주의]**
  - 불필요한 복잡성을 증가시키지 않기 위해 동적 모듈은 필요한 경우에만 사용해야한다.
  - 복잡성증가, 성능저하, 디버깅과 유지보수 어려움을 초래한다.
