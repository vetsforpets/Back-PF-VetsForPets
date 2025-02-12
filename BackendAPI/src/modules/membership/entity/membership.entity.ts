import { Users } from "src/modules/users/entity/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserMembership } from "./user-membership.entity";


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

    @OneToMany(() => UserMembership, (userMembership) => userMembership.membership, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "users_membership" })
    users: UserMembership[];
}
