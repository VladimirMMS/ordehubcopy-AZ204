import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    return orders;
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
    };
    return await this.orderRepository.save(newOrder);
  }
}
