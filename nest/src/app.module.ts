import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { CartEntity } from './cart/entities/cart.entity';
import { CartItemEntity } from './cart/entities/cart-item.entity';
import { ProductEntity } from './cart/entities/product.entity';
import { OrderEntity } from './order/entities/order.entity';
import { UserEntity } from './users/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log('Starting TypeORM configuration...');
        const startTime = Date.now();

        const config: PostgresConnectionOptions = {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [
            CartEntity,
            CartItemEntity,
            ProductEntity,
            OrderEntity,
            UserEntity,
          ],
          synchronize: false,
          logging: false,
          extra: {
            max: 5,
            connectionTimeoutMillis: 2000,
            statement_timeout: 2000,
          },
          ssl: {
            rejectUnauthorized: false,
          },
        };

        console.log(
          `TypeORM configuration completed in ${Date.now() - startTime}ms`,
        );
        return config;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
