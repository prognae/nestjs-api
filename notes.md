npm i prisma
npm i @prisma/client 
npx prisma init

npx prisma migrate dev

nest g service servicename --no-spec // just creates the service file

REQUEST VALIDATION
1. create dto folder (data transfer object) which will store the validation logic and class
2. create index.ts and .dto file
3. insert export type class into .dto file and export it in index file 
4. import dto class into the module controller that u wish to have validation
5. include it beside the decorator of the response (@Body dto: DtoClass)

SAMPLE VALIDATION REQUEST
@IsEmail()
@IsNotEmpty()
email: string;

To use validation globally, import ValidationPipes in main.ts before app.listen
app.useGlobalPipes(new ValidationPipe())
If u want the DTO validation to only read or exclude the defined data in the DTO class, add whitelist to ValidationPipe in main.ts
app.useGlobalPipes(new ValidationPipe({
    whitelist: true
}))

USING ENVIRONMENT VARIABLES
1. npm install @nestjs/config
2. go to root module (app.module.ts) and add ConfigModule.forRoot({ isGlobal: true }) in imports 

API AUTHENTICATION (PASSPORT JWT)
npm i @nestjs/passport passport @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt

1. import in auth.module (JwtModule.register({}))
2. add in constructor in auth.service (private jwt: JwtService)