import { UserMembership } from "src/modules/membership/entity/user-membership.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { Pets } from 'src/modules/pets/entity/pets.entity';
import { Order } from "src/modules/order/entity/order.entity";
import { Location } from "src/modules/location/entity/location.entity";
import { Role } from "src/modules/common/enums/roles.enum";
import { Chat } from "src/modules/chat/entities/chat.entity";

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ nullable: true })
  age: string;

  @Column({ length: 50 })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  isAdmin?: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  imgProfile: string;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ type: 'boolean', default: true }) 
  isActive: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @Column({ type: 'enum', enum: [Role.PETSHOP, Role.USER], default: Role.USER })
  role: Role

  @OneToMany(() => Pets, (pet) => pet.user)
  pets: Pets[]

  @OneToOne(() => UserMembership, (userMembership) => userMembership.user)
  @JoinColumn({ name: "membership" })
  userMembership: UserMembership

  @OneToMany(() => Order, (order) => order.userId)
  order: Order

  @OneToMany(() => Location, (location) => location.user, { cascade: true })
  location: Location[]

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[]

}
