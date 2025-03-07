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

    // console.log("Esto se ejecuta cuando inicia");
  }

  // @UseGuards(WsAuthGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {

    try {
      const user = await this.chatService.validateSocket(client)

      if (!user) {
        client.emit("error", { message: "Token inválido o no existe, desconectando..." })
        client.disconnect()
        return;
      }

      client.data.user = user


      client.emit("connectedUser", {
        userId: user.sub,
        email: user.email
      })

      console.log(`El cliente ${user.email} se ha conectado`)

    } catch (e) {

      console.error("Error en la conexión:", e.message)
      client.emit("error", { message: "Error en la autenticación del WebSocket" })
      client.disconnect();
    }


  }



  handleDisconnect(@ConnectedSocket() client: Socket) {

    try {

      const { user } = client.data

      console.log(`El cliente ${user.email} se ha desconectado`)

    } catch (error) {
      console.error("Error desconectando:", error.message)
    }

  }



  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() vetId: string) {

    try {
      const { user } = client.data
      const chat = await this.chatService.findOrCreateChat(user.sub, vetId)

      if (!chat) {
        client.emit("error", { message: "Chat no encontrado" })
      }


      client.join(chat.id)

      console.log(`El usuario ${user.email} ha ingresado a la sala`)

      client.emit('joinedRoom', chat.id)

      const messages = await this.chatService.findAll(chat.id)

      client.emit('messageHistory', messages)

    } catch (error) {

      console.error("Error en handleJoinRoom:", error.message)

      client.emit("error", { message: "Hubo un error ingresando a la sala" })
    }

  }



  @SubscribeMessage('joinRoomPetshop')
  async handleJoinRoomPetshop(@ConnectedSocket() client: Socket, @MessageBody() chatId: string) {

    const petshop = client.data.user

    client.join(chatId)

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

    try {
      const { user } = client.data


      console.log('chat id:', payload.roomId)

      const message = await this.chatService.saveMessage(payload.roomId, user.sub, payload.message)


      client.broadcast.to(payload.roomId).emit('message', { sender: user.email, message: message.content, senderType: message.senderType })

    } catch (error) {

      console.error("Error enviando un mensaje:", error.message)
      client.emit("errorMessage", { message: "Error al enviar el mensaje" })
    }


  }


}
