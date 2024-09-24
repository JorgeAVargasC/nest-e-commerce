import { Injectable, Logger } from '@nestjs/common'
import { Socket } from 'socket.io'

interface ConnectedClients {
	[id: string]: Socket
}

@Injectable()
export class ChatsService {
	private connectedClients: ConnectedClients = {}

	private logger = new Logger(ChatsService.name)

	registerClient(client: Socket) {
		this.connectedClients[client.id] = client
	}

	removeClient(clientId: string) {
		delete this.connectedClients[clientId]
	}

	getConnectedClients(): string[] {
		const clientsConnected = Object.keys(this.connectedClients)
		this.logger.log(`Client connected: ${clientsConnected}`)
		return clientsConnected
	}
}
