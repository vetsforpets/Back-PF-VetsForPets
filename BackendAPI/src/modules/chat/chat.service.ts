import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'

@Injectable()
export class ChatService {

  constructor(private readonly jwt: JwtService) { }

  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }



  async validateSocket(client: Socket) {

    try {
      const token = client.handshake.headers['authorization']
      const payload = this.jwt.verify(token)

      return payload

    } catch (error) {
      return null
    }

  }


}
