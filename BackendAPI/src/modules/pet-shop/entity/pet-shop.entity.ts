import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'petShop' })
export class PetShop {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  veterinarian: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'boolean' })
  is24Hours: boolean;

  @Column({ nullable: true })
  imgProfile: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  location: string;

  @Column({ type: 'boolean', default: true })
  isVet: boolean;

  @Column({ type: 'bigint'})
  licenseNumber: number;

  @Column({ type: 'json'})
  businessHours: Record<string, {opening: string; closure: string }>

  @OneToMany(()=> Appointment, (appointment) => appointment.petShop )
  appointment: Appointment[]
}
