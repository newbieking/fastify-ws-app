 # Fastify WebSocket Server

A real-time WebSocket server built with Fastify and TypeScript, featuring chat functionality with random user names and AI responses.

## Features

- WebSocket server implementation using Fastify
- TypeScript support for better type safety and development experience
- Real-time chat functionality
- Random user name generation for each client
- AI response simulation
- Support for both echo and chat endpoints
- Modern web interface for testing WebSocket connections

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd fastify-ws-app
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

## Running the Server

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## WebSocket Endpoints

The server provides two WebSocket endpoints:

1. `/ws/echo` - Echo endpoint that sends messages back to the sender
2. `/ws/chat` - Chat endpoint that broadcasts messages to all connected clients

## Testing the WebSocket Server

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see a test interface where you can:
   - Connect to different WebSocket endpoints
   - Send and receive messages
   - See your assigned random name
   - View chat messages from other users

## Project Structure

```
fastify-ws-app/
├── src/
│   └── server.ts        # Main server implementation
├── public/
│   └── test.html        # WebSocket test interface
├── dist/                # Compiled JavaScript files
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── .gitignore          # Git ignore file
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start the development server
- `npm start` - Start the production server

### TypeScript Configuration

The project uses TypeScript for better development experience. The configuration is in `tsconfig.json`.

## Features in Detail

### Random User Names
- Each client gets a unique random name when connecting
- Names are in the format: `[Adjective][Animal][Number]`
- Example: "HappyPanda123", "SwiftEagle456"

### Message Format
Messages are sent in JSON format with the following structure:
```json
{
  "type": "message",
  "sender": "userName",
  "content": "message content"
}
```

### Message Types
- `identity` - Contains the client's assigned name
- `welcome` - Welcome message with the client's name
- `message` - Regular chat messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.