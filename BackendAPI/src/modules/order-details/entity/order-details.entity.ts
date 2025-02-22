import { Membership } from 'src/modules/membership/entity/membership.entity';
import { Order } from 'src/modules/order/entity/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'orderDetails' })
export class OrderDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @OneToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn()
  order: Order;

  @ManyToMany(() => Membership, (membership) => membership.orderDetails)
  @JoinTable()
  membership: Membership[];

  @Column()
  paymentMethod: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 , default: null})
  price: number;
}
