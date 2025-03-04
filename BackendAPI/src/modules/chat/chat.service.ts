import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';

@Injectable()
export class ChatService {

  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(PetShop) private readonly petshopRepository: Repository<PetShop>,

  ) { }



  async findOrCreateChat(userId: string, petshopId: string) {


    const chat = await this.chatRepository.findOne({
      where: { user: { id: userId }, petshop: { id: petshopId } },
    });

    if (!chat) {

      const newChat = this.chatRepository.create({
        user: { id: userId },
        petshop: { id: petshopId },
      });

      await this.chatRepository.save(newChat);

      return newChat
    }

    return chat;
  }



  async findAll(chatId: string) {
    return await this.messageRepository.find({ where: { chat: { id: chatId } }, order: { createdAt: 'ASC' } });
  }



  async saveMessage(chatId: string, senderId: string, content: string) {

    const senderFound = await this.usersRepository.findOne({ where: { id: senderId } })
    const vetSender = await this.petshopRepository.findOne({ where: { id: senderId } })
    const chatFound = await this.chatRepository.findOne({ where: { id: chatId }, relations: { messages: true } })

    if (senderFound) {

      const newMessage = this.messageRepository.create({
        chat: chatFound,
        senderId: senderFound.id,
        content,
        senderType: senderFound.role
      });

      return await this.messageRepository.save(newMessage);

    } else {

      const newMessage = this.messageRepository.create({
        chat: chatFound,
        senderId: vetSender.id,
        content,
        senderType: vetSender.role
      })

      return await this.messageRepository.save(newMessage)
    }


  }



  async validateSocket(client: Socket) {

    try {

      const token = client.handshake.auth.token || client.handshake.query.token || client.handshake.headers.authorization.split(' ')[1] || client.handshake.headers['authorization']

      if (!token) {
        throw new Error("Token inválido o no existe, desconectando...")
      }
      const payload = this.jwt.verify(token)

      return payload

    } catch (e) {
      throw new UnauthorizedException(e.message)
    }

  }


}

