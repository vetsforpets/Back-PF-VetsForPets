import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { PetShop } from '../pet-shop/entity/pet-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Chat, Message, PetShop])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }
