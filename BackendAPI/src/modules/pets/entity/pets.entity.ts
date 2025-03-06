import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { MedicalRecord } from 'src/modules/medical-record/entity/medical-record.entity';
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
import { v4 as uuid } from 'uuid';

@Entity({ name: 'pets' })
export class Pets {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ length: 15 })
  name: string;

  @Column({ type: 'varchar' })
  animalType: string;

  @Column({ type: 'varchar' })
  birthdate: string;

  @Column({ type: 'varchar', nullable: true })
  breed?: string;

  @Column({ type: 'varchar' })
  sex: string;

  @Column({ type: 'boolean', nullable: true })
  isSterilized?: boolean;

  @Column({ type: 'varchar', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', nullable: true })
  profileImg?: string;

  @ManyToOne(() => Users, (user) => user.pets, { eager: true })
  user: Users;

  @Column()
  userId: string;

  @OneToMany(() => Appointment, (appointment) => appointment.pets)
  appointment: Appointment[];

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.pet)
  @JoinColumn({ name: 'medical_record' })
  medicalRecord: MedicalRecord;
}
