import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid} from 'uuid'

@Entity({name: 'orderDetails'})
export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()
    
    @Column()
    orderId: string

    @Column()
    memberShipId: string

    @Column()
    paymentMethod: string
}