import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';



@WebSocketGateway({
  cors: { origin: '*' }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwt: JwtService,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) { }



  afterInit() {

    console.log("Esto se ejecuta cuando inicia");
  }


  async handleConnection(client: Socket) {

    const user = await this.chatService.validateSocket(client)

    if (!user) {
      client.disconnect()
      return
    }

    client.data.user = user


    console.log(`Usuario ${user.email} se ha conectado`)
  }


  handleDisconnect(client: Socket) {

    const { user } = client.data

    console.log(`Cliente ${user.email} se ha desconectado`)

  }


  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, room: string) {
    const roomId = `room_${room}`

    client.join(roomId)

  }


  @SubscribeMessage('leave')
  handleLeaveRoom(client: Socket, room: string) {

    const roomId = `room_${room}`

    console.log(`chau chau adios ${roomId}`)
    client.leave(roomId)

  }


  @SubscribeMessage('message')
  handleIncomingMessage(
    client: Socket,
    payload: { room: string, message: string },
  ) {

    const { room, message } = payload
    console.log(payload);
    this.server.to(`room_${room}`).emit('new_message', message)

  }


  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }


  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }


  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string) {

    this.server.emit('message', message)
  }


}
