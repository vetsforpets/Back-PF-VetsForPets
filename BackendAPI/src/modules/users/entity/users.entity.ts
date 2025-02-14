import { UserMembership } from "src/modules/membership/entity/user-membership.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { Pets } from 'src/modules/pets/entity/pets.entity';
import { Order } from "src/modules/order/entity/order.entity";
import { Location } from "src/modules/location/entity/location.entity";

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  lastName: string;

  @Column()
  age: number;

  @Column({ length: 50 })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 15 })
  phoneNumber: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  imgProfile: string;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @Column({ type: 'boolean', default: false })
  isVet: boolean;

  @OneToMany(() => Pets, (pet) => pet.user)
  pets: Pets[]

  @OneToOne(() => UserMembership, (userMembership) => userMembership.user)
  @JoinColumn({ name: "membership" })
  userMembership: UserMembership

  @OneToMany(()=> Order, (order)=> order.userId )
  order: Order

  @OneToOne(()=> Location, (location)=> location.user)
  @JoinColumn()
  location: Location
}
