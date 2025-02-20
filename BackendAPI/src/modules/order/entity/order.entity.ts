import { OrderDetails } from 'src/modules/order-details/entity/order-details.entity';
import { Users } from 'src/modules/users/entity/users.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @ManyToOne(() => Users, (userId) => userId.order)
  userId: Partial<Users>

  @OneToOne(() => OrderDetails, orderDetails => orderDetails.order)
  orderDetails: OrderDetails

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ nullable: true })
  sessionId: string;
}
