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
    animalType: string

    @Column({type:'varchar'})
    birthdate: string

    @Column({type:'varchar', nullable: true})
    breed?:string 

    @Column({type:'varchar'})
    sex: string

    @Column({type:'boolean', nullable: true})
    isSterilized?: boolean

    @Column({type:'varchar', nullable: true})
    notes?: string

    @Column({type:'varchar', nullable: true})
    profileImg?: string

    @ManyToOne(() => Users,  (user) => user.pets)
    user: Users

    @Column()
    userId: string
}