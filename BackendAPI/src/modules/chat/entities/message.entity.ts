import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Role } from "src/modules/common/enums/roles.enum";


@Entity({ name: 'messages' })
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    senderId: string

    @Column({ type: 'enum', enum: Role })
    senderType: Role

    @Column()
    content: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat
}