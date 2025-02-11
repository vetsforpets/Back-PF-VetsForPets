import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {v4 as uuid} from 'uuid'

@Entity({ name: 'petShop' })
export class PetShop {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()
    
    @Column()
    name: string

    @Column()
    email: string 

    @Column()
    password: string

    @Column()
    phoneNumber: string

    @Column({type: 'boolean'})
    is24Hours: boolean

    @Column({nullable: true})
    img: string

    @Column({type:'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column()
    location: string

    @Column({type: 'boolean', default: true})
    isVet: boolean

}
