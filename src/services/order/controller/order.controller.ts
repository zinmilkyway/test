// import { OrderService } from '../service/order.service'
// import { OrderEntity } from '../order.entity';
// import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// @Controller('api/v1/order')
// export class OrderController {
//     constructor(private orderService: OrderService) { }


//     @UseGuards(JwtAuthGuard)
//     @Post()
//     async order(@Request() req): Promise<OrderEntity> {
//         return this.orderService.order(req.user.username)
//     }

//     @UseGuards(JwtAuthGuard)
//     @Get()
//     async getOrders(@Request() req): Promise<OrderEntity[]> {
//         return await this.orderService.getOrders(req.user.username)
//     }
// }
