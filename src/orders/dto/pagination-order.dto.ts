import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";


export class PaginationOrderDto extends PaginationDto {
    @IsOptional()
    @IsEnum( OrderStatusList, {
        message: `Valid status are ${OrderStatusList}`
    })
    status: OrderStatus
}