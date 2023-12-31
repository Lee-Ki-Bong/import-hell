## 모듈 간의 프로바이더 공유와 관리

- 모듈 간의 의존성 관리를 더욱 효과적으로 처리하기 위한 방법들을 적어보았다.
- 예를 들어 아래와 같이 말티즈 모듈과 보더콜리 모듈이 있다고 하자.

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
- DDD에서 말하는 공통된 "아규먼트(Argument)"를 찾아 모델화하여 그 모델을 공통 모듈로 만들어 공유한다.
- 이 예시에선 공통된 기능인 '짖다' 의 기능을 가진 공통모듈을 생성했다.

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

  @Get('showingBelly')
  showingBelly() {
    return this.malteseService.showingBelly();
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
  showingBelly() {
    return '배 보여주기'; // 말티즈만의 고유 기능
  }
}
```

## 3.다이나믹 모듈을 이용하여 동적으로 프로바이더를 의존성 주입해주는 방법

- 예시로든 믹스견모듈은 어떤 견종과 믹스가 될지 모르며, 추 후 다른 종과도 믹스가 될 가능성이 높다고 가정하여 작성해보았다.
- 즉, 상황에 따라 동적으로 외부 프로바이더들을 사용해야할 경우이다.
- 필요할때마다 모듈을 전부 import 시켜사용한다면, import 지옥이 펼쳐질 것이다.
- 이럴때 동적모듈을 사용해야할 시점이다.
- 믹스견 동적모듈 구조

```javascript
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
```

- 믹스견모듈에서 필요한 강아지 기능들을 주입한 모습.

```javascript
@Module({
  imports: [
    MixedDogModule.forRoot([DogService, MalteseService, BorderCollieService]), // 주입
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

  @Get('showingBelly')
  showingBelly() {
    return this.malteseService.showingBelly();
  }

  @Get('playFrisbee')
  playFrisbee() {
    return this.borderCollieService.playFrisbee();
  }
}

```

- forRoot()를 사용하여 등록한 서비스들은 MixedDogModule 내부에서만 사용 가능하다.
- 이 서비스들은 MixedDogModule 내부에서 자체적으로 관리가 되어 따로 말티즈, 보더콜리 모듈을 믹스견 모듈에서 import하지 않아도 사용이 가능하다.
- 추가로, forRoot() 메서드를 사용하는 MixedDogModule 모듈은 싱글톤으로 관리되며, 모듈 내에 주입받은 프로바이더들은(서비스, 컨트롤러 등) 모듈 전체에서 의존성 주입하여 사용할 수 있다.

- **[주의]**

  - 불필요한 복잡성을 증가시키지 않기 위해 동적 모듈은 필요한 경우에만 사용해야한다.
  - 복잡성증가, 성능저하, 디버깅과 유지보수 어려움을 초래한다.

## **[TMI]**

### 믹스견 모듈 리펙토링

- 믹스견모듈 처럼 어떤 프로바인더가 들어와도 무방한 코드는 확장성에서 좋을지 모르나, 그 의존성이 명확하지 못하다.
- 예를들어 고양이모듈이 들어오게 되면 더이상 강아지가 아니게 되는 것과 같이 끔찍한 혼종 모듈이 탄생할 수 있기 때문이다.

- 와 같이 이 모듈에 의존성을 명확히 하는 것이 권장사항이다.

```javascript
static forRoot(
  dogService:DogService,
  malteseService:MalteseService,
  borderCollieService:BorderCollieService
) {}
```

### 모듈에 is_global : true 옵션

- is_global = true 옵션 사용을 주의해야한다.

### is_global 옵션이란

```javascript
@Module({
imports: [
  ModuleA.forRoot({
    isGlobal: true,
  }),
];
})
export class AppModule {}
```

- NestJS에서 모듈의 is_global 속성을 true로 설정하면 해당 모듈의 공급자 및 내보낸 프로바이더가 전역으로 등록된다.
- 이는 여러 모듈에서 동일한 인스턴스를 공유할 수 있도록 해준다.
- 그러나, 이를 많이 사용하게 되면 몇 가지 부정적인 결과를 초래한다.
- (@Global() 데커레이터도 마친가지)

### 부작용

- 복잡성 : 전역 모듈을 사용하면 의존성 그래프가 더 복잡해진다. 각 모듈이 필요로 하는 종속성을 명시적으로 정의하는 것이 좋다.
- 의도하지 않은 부작용 : 상태를 유지하는 서비스의 경우, 전역 인스턴스를 공유하면 예기치 않은 데이터 변경이 발생수있다. 어디에서든 해당 모듈이 사용하는 DB를 조작할 수 있기 때문이다.
- 테스트 설계 어려움 : 전역 모듈을 사용하면 모듈 간의 의존성을 명확하게 추적하기 어렵다. 어디에서 부터 어디까지 테스트 해야하는지 어렵게 만든다.

#

## 외부 서비스를 프로바이더로 의존성 주입하는 방식은 권장되지 않는다.

```javascript
@Module({
  // imports: [DogModule], 모듈이 아닌
  controllers: [MalteseController],
  providers: [MalteseService, DogService], // 외부서비스를 바로 프로바이더로 의존성 주입. [권장되는 방식이 아님]
})
export class MalteseModule {}
```

- [docs](https://docs.nestjs.com/modules) 에서는 모듈을 사용하여 컴포넌트 의존성 그래프를 구축하는 것을 **강력하게** 권장하고 있다.
- 이유는 명시적인 의존성 관리때문이다.

  - 공통 모듈을 import 배열에 포함시킴으로써 모듈간 의존성을 명확하게 알 수 있다.
  - 사용하는 서비스가 어떤 모듈에서 제공되는지 명확하게 알 수 있다.

- 요약하면, @Module() 데코레이터의 imports 배열을 사용하여 모듈 간의 의존성을 명시적으로 정의하여 관리하자 이다.

#

## 외부 모듈 서비스를 모듈내에서 의존성 주입하여 사용하지 않는 것을 제안.

- 이유는 의존성 관리에 어려움을 초래할 수 있다.
- 예를 들어, A 모듈의 ServiceA가 B 모듈의 ServiceB를 의존성 주입받는다고 가정해보자.

```javascript
export class ServiceA {
  constructor(
    private readonly serviceB: ServiceB // [권장되는 방식이 아님.]
  )
```

- 이렇게 되면 다른 모듈에서 A모듈의 ServiceA를 주입받을때 ServiceB가 문제가 발생한다.
- 이는 모듈 간의 결합도가 높아지고, 의존성을 명확히 추적하기 어려워지는 상황을 초래한다.
- 때문에 모듈 간 결합도 느슨하게 하기위해, 컨트롤러에 서비스를 주입을 받아 사용하는 것을 권장한다.

```
@Controller()
export class SomeController {
  constructor(private readonly someService: SomeService) {
  }
}

```

```
[경고] 네스트는 모듈간 의존성 관계들이 눈에 보이지 않아 명확히 관계를 안하면 나중에 임포트 찾는데 많은 시간을 투자해야할 지도 모른다.
```
[참고문헌] "NestJS로 배우는 백엔드 프로그래밍" 이란 책을 혹시 가지고 계신분은 91~97 페이지를 참고 바랍니다.
