import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid} from 'uuid'

@Entity({ name: 'PetShop' })
export class PetShop {
    @PrimaryGeneratedColumn()
    id: string = uuid()
    
    @Column()
    name: string

    @Column()
    email: string 

    @Column()
    password: string

    @Column()
    phoneNumber: string

    @Column()
    is24Hours: boolean

    @Column()
    img: string

    @Column()
    createdAt: string

    @Column()
    location: string

}
