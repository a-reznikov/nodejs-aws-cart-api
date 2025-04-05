import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { CartItemEntity } from './entities/cart-item.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('api/profile/cart')
@UsePipes(new ValidationPipe({ transform: true }))
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItemEntity[]> {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items.map((item) => new CartItemEntity(item));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(BasicAuthGuard)
  @Put()
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: UpdateCartDto,
  ): Promise<CartItemEntity[]> {
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items.map((item) => new CartItemEntity(item));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  @UseGuards(BasicAuthGuard)
  @Put('checkout')
  @UsePipes(new ValidationPipe())
  async checkout(
    @Req() req: AppRequest,
    @Body() body: CheckoutDto,
  ): Promise<OrderEntity> {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      throw new BadRequestException('Cart is empty');
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(items);

    return await this.cartService.checkout({
      userId,
      cartId,
      total,
      body,
    });
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<OrderEntity[]> {
    return await this.orderService.getAll();
  }
}
