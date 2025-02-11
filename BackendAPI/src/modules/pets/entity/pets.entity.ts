import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
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

    @Column({type:'varchar'})
    breed:string

    @Column({type:'varchar'})
    sex: string

    @Column({type:'boolean'})
    isSterilized: boolean

    @Column({type:'varchar'})
    notes: string

    @Column({type:'varchar'})
    profileImg: string
}