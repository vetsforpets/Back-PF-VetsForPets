import { Users } from "src/modules/users/entity/users.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Membership } from "./membership.entity";


@Entity({ name: 'user_membership' })
export class UserMembership {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    startDate?: Date

    @Column({ nullable: true })
    endDate?: Date

    @Column({ default: true })
    status: boolean

    @OneToOne(() => Users, (user) => user.userMembership)
    user: Users

    @ManyToOne(() => Membership, (membership) => membership.users)
    membership: Membership
}