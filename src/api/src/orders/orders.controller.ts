import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/common/guards/auth.guard';
import { RolesGuard } from 'src/auth/common/guards/role.guard';
import { Roles } from 'src/auth/common/consts';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator', 'viewer')
  @Get()
  async getOrders() {
    return await this.ordersService.findAll();
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createOrder(
    @Body() body: { customerId: string; total: number; status: string },
  ) {
    return await this.ordersService.create(body);
  }
}
