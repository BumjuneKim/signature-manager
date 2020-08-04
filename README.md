## Installation

```bash
$ npm install
```

## .env file

레파지토리 root내 .env.examaple을 참조하여 .env와 .env.docker 를 생성합니다.

(.env.docker는 docker 구동시 참조)

.env에 필요한 환경변수는 다음과 같이 5개 입니다.

```
DB_CONNECTION_STRING=mongodb://<user>:<pw>@localhost:27017/<db>
# .env의 경우
	# ex) mongodb://test-user:1234@localhost:27017/sign
# .env.docker의 경우
	# ex) mongodb://test-user:1234@host.docker.internal:27017/sign

# 아래 AWS 관련 정보는 s3에 image upload용으로 사용
AWS_KEY=<AWS Key>

AWS_SECRET=<AWS Secret>

S3_BUCKET=<S3 Bucket>

S3_REGION=<S3 Region>
```

## Running the app

```bash
# 7000번 포트로 run
# api 문서는 다음에서 확인
# http://localhost:7000/api
$ npm run start


# run on docker
$ docker-compose up
```

