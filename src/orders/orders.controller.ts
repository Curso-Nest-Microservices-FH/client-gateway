import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from '../orders/dto/create-order.dto'
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
  }

  @Get()
  async findAll(@Query() paginationOrderDto : PaginationOrderDto) {
    
    try {

      const orders = await firstValueFrom(
        this.client.send('findAllOrders', paginationOrderDto)
      )
      return orders
      
    } catch (error) {
      throw new RpcException(error)
    }  

  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', {id})
      )
      return order
      
    } catch (error) {
      throw new RpcException(error)
    }
    
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {

      
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      })
    
    } catch (error) {
      throw new RpcException(error)
    }
}


@Patch(':id')
changeStatus (
  @Param('id', ParseUUIDPipe) id: string,
  @Body() statusDto: StatusDto,
) {

  try {
    return this.client.send('changeOrderStatus', {id, status: statusDto.status})
  } catch (error) {
    throw new RpcException(error)
  }
}

}
