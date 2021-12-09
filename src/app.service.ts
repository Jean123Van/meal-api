import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<center><h1>Meal-planner API is not publicly accessible.</h1></center>';
  }
}
