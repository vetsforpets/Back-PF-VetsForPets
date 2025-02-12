import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: "medical_record" })
export class MedicalRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50 })
    breed: string

    @Column({ type: "string" })
    date: Date

    @Column({ type: "string" })
    examResults: string

    @Column({ nullable: true })
    image: string

}
