import fastify, { FastifyInstance } from 'fastify';
import { SocketStream } from '@fastify/websocket';
import path from 'path';
import fs from 'fs';
import { WebSocket } from 'ws';
import { connect } from 'http2';

// Generate random mock names for clients
function generateRandomName(): string {
    const adjectives = ['Happy', 'Clever', 'Brave', 'Swift', 'Bright', 'Wise', 'Calm', 'Eager', 'Fierce', 'Gentle'];
    const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Wolf', 'Lion', 'Fox', 'Bear', 'Hawk', 'Dragon'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    return `${randomAdjective}${randomNoun}${randomNumber}`;
}

// AI response generator function
function generateAIResponse(message: string): string {
  const responses = [
    "I understand what you're saying.",
    "That's an interesting point!",
    "Let me think about that...",
    "I'm processing your message.",
    "Thanks for sharing that with me.",
    "I'm here to help!",
    "That's a great question!",
    "I'm analyzing your input.",
    "Let me respond to that...",
    "I'm learning from our conversation."
  ];
  
  // Add a small delay to simulate AI processing
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `AI: ${randomResponse} (responding to: "${message}")`;
}

const server: FastifyInstance = fastify({ logger: true });

// Register WebSocket plugin
server.register(require('@fastify/websocket'));

// WebSocket route
server.register(async function (fastify) {
  fastify.get('/ws/echo', { websocket: true }, (connection: SocketStream) => {
    const clientName = generateRandomName();
    server.log.info(`New WebSocket connection established for ${clientName}`);

    // Send the client their assigned name
    connection.socket.send(JSON.stringify({
      type: 'identity',
      name: clientName
    }));

    connection.socket.on('message', (message: Buffer) => {
      server.log.info(`Received message from ${clientName}:`, message.toString());
      try {
        // Echo the received message back to the client with their name
        connection.socket.send(JSON.stringify({
          type: 'message',
          sender: clientName,
          content: message.toString()
        }));
        server.log.info('Message echoed back to client');
      } catch (error) {
        server.log.error('Error sending message:', error);
      }
    });

    connection.socket.on('error', (error: Error) => {
      server.log.error(`WebSocket error for ${clientName}:`, error);
    });

    connection.socket.on('close', (code: number, reason: string) => {
      server.log.info(`WebSocket connection closed for ${clientName}. Code:`, code, 'Reason:', reason);
      // Close and remove the client socket
      if (connection.socket) {
        connection.socket.close();
        // Optionally, remove the client from the list of connected clients
        fastify.websocketServer.clients.delete(connection.socket as unknown as WebSocket);
      }
    });

    // Send a welcome message
    try {
      connection.socket.send(JSON.stringify({
        type: 'welcome',
        message: `Welcome to the WebSocket server, ${clientName}!`
      }));
      server.log.info('Welcome message sent');
    } catch (error) {
      server.log.error('Error sending welcome message:', error);
    }
  });

  // add a route for /ws/chat
  fastify.get('/ws/chat', { websocket: true }, (connection: SocketStream) => {
    const clientName = generateRandomName();
    server.log.info(`New WebSocket connection established for ${clientName}`);

    // Send the client their assigned name
    connection.socket.send(JSON.stringify({
      type: 'identity',
      name: clientName
    }));

    connection.socket.on('message', (message: Buffer) => {
      const messageStr = message.toString();
      server.log.info(`Received message from ${clientName}:`, messageStr);
      
      // Send the message to all clients with the sender's name
      fastify.websocketServer.clients.forEach((client) => {
        const ws = client as unknown as WebSocket;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'message',
            sender: clientName,
            content: messageStr
          }));
        }
      });

      // Only generate AI response if message starts with '@ai'
      if (messageStr.startsWith('@ai')) {
        // Remove the 'at-ai' prefix from the message
        const aiMessage = messageStr.slice(3).trim();
        
        // Generate and send AI response after a short delay
        setTimeout(() => {
          const aiResponse = generateAIResponse(aiMessage);
          fastify.websocketServer.clients.forEach((client) => {
            const ws = client as unknown as WebSocket;
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'message',
                sender: 'AI',
                content: aiResponse
              }));
            }
          });
        }, 1000); // 1 second delay to simulate AI processing
      }
    });

    connection.socket.on('error', (error: Error) => {
      server.log.error(`WebSocket error for ${clientName}:`, error);
    });

    connection.socket.on('close', (code: number, reason: string) => {
      server.log.info(`WebSocket connection closed for ${clientName}. Code:`, code, 'Reason:', reason);
      // Close and remove the client socket
      if (connection.socket) {
        connection.socket.close();
        // Optionally, remove the client from the list of connected clients
        fastify.websocketServer.clients.delete(connection.socket as unknown as WebSocket);
      }
    });

    // Send a welcome message
    try {
      connection.socket.send(JSON.stringify({
        type: 'welcome',
        message: `Welcome to the chat server, ${clientName}!`
      }));
      server.log.info('Welcome message sent');
    } catch (error) {
      server.log.error('Error sending welcome message:', error);
    }
  });
});

// HTTP route for testing
server.get('/', async (request, reply) => {
  reply.type('text/html');
  const htmlContent = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
  return htmlContent;
});

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info('Server is running on http://0.0.0.0:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 