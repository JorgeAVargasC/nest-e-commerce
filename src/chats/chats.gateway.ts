import {
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
	SubscribeMessage
} from '@nestjs/websockets'
import { ChatsService } from './chats.service'
import { Server, Socket } from 'socket.io'
import { NewMessageFromClientDto } from './dto/message-from-client'

@WebSocketGateway({
	cors: true
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server

	constructor(private readonly chatsService: ChatsService) {}

	handleConnection(client: Socket) {
		this.chatsService.registerClient(client)
		this.chatsService.getConnectedClients()
		this.wss.emit('clients-updated', this.chatsService.getConnectedClients())
	}

	handleDisconnect(client: Socket) {
		this.chatsService.removeClient(client.id)
		this.chatsService.getConnectedClients()
		this.wss.emit('clients-updated', this.chatsService.getConnectedClients())
	}

	@SubscribeMessage('message-from-client')
	handleMessageFromClient(client: Socket, payload: NewMessageFromClientDto) {
		//? Emit only to the client that sent the message
		// client.emit('message-from-server', {
		// 	fullName: 'Soy Yo',
		// 	message: payload.message
		// })

		//? Emit to all clients connected except the client that sent the message
		client.broadcast.emit('message-from-server', {
			fullName: 'Soy Yo',
			msg: payload.msg
		})

		//? Emit to all clients connected
		this.wss.emit('message-from-server', {
			fullName: 'Soy Yo',
			msg: payload.msg
		})
	}
}
