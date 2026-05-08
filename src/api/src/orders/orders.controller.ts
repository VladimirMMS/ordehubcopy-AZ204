import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get()
  async getOrders() {
    return await this.ordersService.findAll();
  }
  @Post()
  async createOrder(
    @Body() body: { customerId: string; total: number; status: string },
  ) {
    return await this.ordersService.create(body);
  }
}
