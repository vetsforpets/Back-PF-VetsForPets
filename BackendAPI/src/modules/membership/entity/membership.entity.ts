import { Users } from "src/modules/users/entity/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'membership' })
export class Membership {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number

    @Column('text', { array: true, nullable: false })
    benefits: string[]

    @Column({ nullable: true })
    startDate?: Date

    @Column({ nullable: true })
    endDate?: Date

    @Column({ default: false })
    status: boolean

    @ManyToOne(() => Users, (user) => user.membership, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "users" })
    users: Users[]
}