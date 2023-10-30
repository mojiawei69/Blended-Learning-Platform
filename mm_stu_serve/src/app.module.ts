import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './Modules/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RootModule } from './Modules/root/root.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "123456",
      "database": "mm_stu",
      "entities": ["./src/**/*.entity{.ts,.js}"],
      "synchronize": true
    }),
    RootModule,
    CommonModule  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}