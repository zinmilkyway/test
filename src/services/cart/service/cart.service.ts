import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/services/product/products.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productsService: ProductsService
  ) {}

  async addToCart(
    productId: string,
    quantity: number,
    user: string
  ): Promise<any> {
    try {
      const cartItems = await this.cartRepository.find({
        where: { userId: user }
      });
      const product = await this.productsService.getOne(productId);

      if (product) {
        //confirm if item is exists in the cart
        const cart = cartItems.filter(
          (item) => item.productId === productId && item.userId === user
        );
        if (cart.length < 1) {
          const newItem = {
            productId: product.id,
            price: product.price,
            quantity,
            total: product.price * quantity,
            userId: user
          };
          await this.cartRepository.save(newItem);
        } else {
          //Update the item quantity
          const updatedQuantity = (cart[0].quantity += quantity);
          const total = cart[0].price * updatedQuantity;

          await this.cartRepository.update(cart[0].id, {
            quantity: updatedQuantity,
            total
          });
        }
      }
      return 'Success';
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getItemsInCard(user: string): Promise<CartEntity[]> {
    const userCart = await this.cartRepository.find({
      where: { userId: user }
    });
    return userCart;
  }

  async emptyCart(userId: string): Promise<any> {
    return this.cartRepository.delete({ userId: userId });
  }
}
