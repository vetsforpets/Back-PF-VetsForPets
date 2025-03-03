import { PetShop } from "src/modules/pet-shop/entity/pet-shop.entity";
import { Users } from "src/modules/users/entity/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";



@Entity({ name: 'chats' })
export class Chat {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Users, (user) => user.chats)
    user: Users

    @ManyToOne(() => PetShop, (petshop) => petshop.chats)
    petshop: PetShop

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[]

    @CreateDateColumn()
    createdAt: Date



}
