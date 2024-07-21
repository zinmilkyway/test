import { JwtAuthGuard } from '@/services/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartEntity } from '../cart.entity';
import { CartService } from '../service/cart.service';

@ApiTags('cart')
@Controller('api/v1/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async AddToCart(@Body() body, @Request() req): Promise<void> {
    const { productId, quantity } = body;
    return await this.cartService.addToCart(
      productId,
      quantity,
      req.user.username
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getItemsInCart(@Request() req): Promise<CartEntity[]> {
    return await this.cartService.getItemsInCard(req.user.username);
  }

  @Delete()
  async emptyCart(): Promise<void> {
    return this.cartService.emptyCart();
  }
}
