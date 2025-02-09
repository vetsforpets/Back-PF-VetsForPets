import { Users } from "src/modules/users/entity/users.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import {v4 as uuid} from 'uuid'

@Entity({name: "pets"})
export class Pets {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()

    @Column({length: 15})
    name: string

    @Column({type:'int'})
    age: number

    @Column({type:'varchar'})
    type: string

    @Column({type:'varchar'})
    dateOfBirth: string

    @Column({type:'varchar'})
    profileImg: string

    @ManyToOne(() => Users, (user) => user.pets)
    user: Users
}