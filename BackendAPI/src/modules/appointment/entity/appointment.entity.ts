import { StatusEnum } from '../../../modules/common/enums/status.enum';
import { Location } from '../../../modules/location/entity/location.entity';
import { MedicalRecord } from '../../../modules/medical-record/entity/medical-record.entity';
import { PetShop } from '../../../modules/pet-shop/entity/pet-shop.entity';
import { Pets } from '../../../modules/pets/entity/pets.entity';
import { Users } from '../../../modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @ManyToOne(() => Users, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: Partial<Users>;

  @ManyToOne(() => Pets, (pets) => pets.appointment)
  pets: Pets;

  @ManyToOne(() => PetShop, (petshop) => petshop.appointment)
  petShop: PetShop

  @OneToOne(() => MedicalRecord, medicalRecord => medicalRecord.appointment)
  @JoinColumn({ name: "medical_record" })
  medicalRecord: MedicalRecord

  @OneToOne(() => Location, (location) => location.appointment)
  @JoinColumn()
  location: Location
}
