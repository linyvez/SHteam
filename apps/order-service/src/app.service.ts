import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  connectCassandra() {
    
  }

  getHello(): string {
    return 'Hello World!';
  }
}
