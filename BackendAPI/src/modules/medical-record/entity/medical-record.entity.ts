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

    @Column()
    examResults: string

    @Column({ nullable: true })
    image: string

    @OneToOne(() => Pets, pet => pet.medicalRecord)
    pet: Pets

    @ManyToOne(() => PetShop, petshop => petshop.medicalRecords)
    @JoinColumn({ name: "petshop_id" })
    petshop: PetShop

    @OneToOne(() => Appointment, appointment => appointment.medicalRecord)
    appointment: Appointment

}
