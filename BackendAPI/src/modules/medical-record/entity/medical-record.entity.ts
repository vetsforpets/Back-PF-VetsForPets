import { Appointment } from "src/modules/appointment/entity/appointment.entity";
import { PetShop } from "src/modules/pet-shop/entity/pet-shop.entity";
import { Pets } from "src/modules/pets/entity/pets.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "medical_record" })
export class MedicalRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50 })
    breed: string

    @Column()
    date: Date

    @Column("text", { array: true, nullable: true })
    examResults?: string[]

    @Column('text', { nullable: true, array: true })
    image?: string[]

    // @ManyToOne(() => Pets, pet => pet.medicalRecords)
    // pet: Pets

    @ManyToOne(() => PetShop, petshop => petshop.medicalRecords)
    @JoinColumn({ name: "petshop_id" })
    petshop: PetShop

    @OneToOne(() => Appointment, appointment => appointment.medicalRecord)
    appointment: Appointment

}
