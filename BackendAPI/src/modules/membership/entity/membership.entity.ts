import { Users } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMembership } from './user-membership.entity';
import { PetShop } from 'src/modules/pet-shop/entity/pet-shop.entity';
import { OrderDetails } from 'src/modules/order-details/entity/order-details.entity';

@Entity({ name: 'membership' })
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true, nullable: false })
  benefits: string[];

  @OneToMany(
    () => UserMembership,
    (userMembership) => userMembership.membership,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'users_membership' })
  users: UserMembership[];

  @OneToOne(() => PetShop, (petShop) => petShop.membership)
  petShop: PetShop;

  @OneToOne(()=> OrderDetails, orderDetails => orderDetails.membershipId )
  orderDetails: OrderDetails
}
