import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io'
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../common/guards/auth-ws.guard';



@WebSocketGateway({
  cors: { origin: '*' }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly chatService: ChatService,
  ) { }



  afterInit() {

    console.log("Esto se ejecuta cuando inicia");
  }

  // @UseGuards(WsAuthGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {

    const user = await this.chatService.validateSocket(client)

    if (!user) {
      client.disconnect()
      throw new UnauthorizedException('Token inválido o no existe, desconectando...')
    }

    client.data.user = user


    client.emit("connectedUser", {
      userId: user.sub,
      email: user.email
    })

    console.log(`El cliente ${user.email} se ha conectado`)
  }



  handleDisconnect(@ConnectedSocket() client: Socket) {

    const { user } = client.data

    console.log(`El cliente ${user.email} se ha desconectado`)

  }



  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() vetId: string) {

    const { user } = client.data
    const chat = await this.chatService.findOrCreateChat(user.sub, vetId)

    const roomId = `chat_${chat.id}`

    client.join(roomId)

    console.log(`El usuario ${user.email} ha ingresado a la sala`)

    client.emit('joinedRoom', { roomId })

    const messages = await this.chatService.findAll(chat.id)

    client.emit('messageHistory', messages)

  }



  @SubscribeMessage('joinRoomPetshop')
  async handleJoinRoomPetshop(@ConnectedSocket() client: Socket, @MessageBody() chatId: string) {

    const petshop = client.data.user
    const roomId = `chat_${chatId}`

    client.join(roomId)

    const messages = await this.chatService.findAll(chatId)
    client.emit('messageHistory', messages)

    console.log(`Veterinaria ${petshop.email} se unió a la sala.`)

  }



  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomId: string) {

    const { user } = client.data

    console.log(`El cliente ${user.email} ha dejado la sala`)

    client.leave(roomId)
  }



  @SubscribeMessage('message')
  async handleIncomingMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string, message: string },
  ) {

    const { user } = client.data
    const chatId = payload.roomId.split('_')[1];

    console.log('chat id:', chatId)

    const message = await this.chatService.saveMessage(chatId, user.sub, payload.message)


    client.broadcast.to(payload.roomId).emit('message', { sender: user.email, message: message.content, senderType: message.senderType })

  }


}
