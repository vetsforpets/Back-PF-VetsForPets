import { Appointment } from 'src/modules/appointment/entity/appointment.entity';
import { Role } from 'src/modules/common/enums/roles.enum';
import { MedicalRecord } from 'src/modules/medical-record/entity/medical-record.entity';
import { Membership } from 'src/modules/membership/entity/membership.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column({ default: null })
  location: string;

  @Column({ type: 'varchar', default: null })
  foundation: string

  @Column({ type: 'enum', enum: [Role.PETSHOP, Role.USER], default: Role.PETSHOP })
  role: Role

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'bigint' })
  licenseNumber: number;

  @Column({ type: 'json', default: null })
  businessHours: Record<string, { opening: string; closure: string }>;

  @OneToMany(() => Appointment, (appointment) => appointment.petShop)
  appointment: Appointment[];

  @OneToOne(() => Membership, (membership) => membership.petShop)
  @JoinColumn()
  membership: Membership;

  @OneToMany(() => MedicalRecord, (medicalRecord) => medicalRecord.petshop)
  medicalRecords: MedicalRecord[];

  // @OneToMany(() => Location, (location) => location.user)
  // location: Location[];
}
