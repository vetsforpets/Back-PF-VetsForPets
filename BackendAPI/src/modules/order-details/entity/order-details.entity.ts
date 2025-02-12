import { Order } from 'src/modules/order/entity/order.entity';
import { Column, Entity, JoinTable, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid} from 'uuid'

@Entity({name: 'orderDetails'})
export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()
    
    @OneToOne(()=> Order, order => order.orderDetails)
    @JoinTable()
    order: string

    @Column()
    memberShipId: string

    @Column()
    paymentMethod: string
}