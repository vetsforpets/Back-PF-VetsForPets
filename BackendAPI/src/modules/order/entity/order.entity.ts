import { OrderDetails } from 'src/modules/order-details/entity/order-details.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column()
  price: number

  @Column()
  userId: string

  @OneToOne(()=> OrderDetails, orderDetails => orderDetails.order)
  orderDetails: string
}
