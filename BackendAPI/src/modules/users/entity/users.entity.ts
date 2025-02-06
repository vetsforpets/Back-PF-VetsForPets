import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import {v4 as uuid} from 'uuid'

@Entity({name: "users"})
export class Users {
    @PrimaryGeneratedColumn()
    id: string = uuid()

    @Column({length: 50})
    name: string 

    @Column({length: 50})
    lastName: string

    @Column()
    age: number

    @Column({length: 50})
    email: string

    @Column({nullable: false})
    password: string

    @Column({length: 15})
    phoneNumber: string

    @Column({length: 50})
    createdAt: string

    @Column({nullable: true})
    imgProfile: string

    @Column()
    isPremium: boolean



}