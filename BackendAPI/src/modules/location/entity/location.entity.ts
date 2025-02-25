import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { PetShop } from '../../../modules/pet-shop/entity/pet-shop.entity';
import { Users } from '../../../modules/users/entity/users.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'location' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @OneToOne(() => Users, (user) => user.location)
  user: Users;

  @ManyToOne(() => PetShop, (petShop) => petShop.location)
  petShop: PetShop;

  @OneToOne(() => Appointment, (appoinment) => appoinment.location)
  appointment: Appointment;
}
