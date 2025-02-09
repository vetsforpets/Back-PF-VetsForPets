import { StatusEnum } from "src/modules/common/enums/status.enum";
import { Users } from "src/modules/users/entity/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'appointments' })
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'date' })
    date: Date

    @Column({ type: 'time' })
    time: string

    @Column({ type: 'text' })
    description: string

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.ACTIVE
    })
    status: StatusEnum


    @ManyToOne(() => Users, (user) => user.appointments)
    @JoinColumn({ name: 'user_id' })
    user: Users

}