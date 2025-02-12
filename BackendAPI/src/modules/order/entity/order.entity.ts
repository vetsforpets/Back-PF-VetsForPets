import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  orderDetail: string
}
