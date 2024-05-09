import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAllOrders(@Query() paginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto);
  }

  @Get(':id')
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
      //? Aqui otra forma de manejar el error utilizando catchError de rxjs.
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  changeStatus(
    @Body() statusDto: StatusDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersClient
      .send('changeOrderStatus', { id, status: statusDto.status })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
