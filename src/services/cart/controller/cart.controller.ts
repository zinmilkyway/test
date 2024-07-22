import { JwtAuthGuard } from '@/services/auth/jwt-auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CartEntity } from '../cart.entity';
import { CartService } from '../service/cart.service';

@ApiTags('cart')
@Controller('api/v1/cart')
@ApiBearerAuth('accessToken')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          format: 'number'
        },
        productId: {
          type: 'string',
          format: 'string'
        }
      }
    }
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async AddToCart(@Body() body, @Request() req): Promise<void> {
    const { productId, quantity } = body;
    return await this.cartService.addToCart(
      productId,
      quantity,
      req.user.username
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getItemsInCart(@Request() req): Promise<CartEntity[]> {
    return await this.cartService.getItemsInCard(req.user.username);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async emptyCart(@Request() req): Promise<boolean> {
    try {
      await this.cartService.emptyCart(req.user.username);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
