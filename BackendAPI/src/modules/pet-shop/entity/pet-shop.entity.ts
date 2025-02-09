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

    @Column({type: 'boolean'})
    is24Hours: boolean

    @Column({nullable: true})
    img: string

    @Column({type:'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column()
    location: string

}
