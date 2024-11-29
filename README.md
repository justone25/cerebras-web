# Cerebras Chat Web Application

A ChatGPT-like web application built using the Cerebras Node SDK.

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Add your Cerebras API key to the `.env` file

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Deployment

### Using Docker (Recommended)

1. Build and run using Docker Compose:
```bash
docker-compose up -d
```

### Manual Deployment

1. Clone the repository on your server:
```bash
git clone <your-repo-url>
cd cerebras-web
```

2. Install dependencies:
```bash
npm install --production
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your production values
```

4. Start the application:
```bash
npm start
```

### Using PM2 (Production Process Manager)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
pm2 start server.js --name cerebras-chat
```

3. Configure PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

## Features

- Real-time chat interface
- Powered by Cerebras AI models
- Modern, responsive design
- Easy-to-use interface

## Tech Stack

- Backend: Node.js with Express
- Frontend: Vanilla JavaScript with Tailwind CSS
- AI: Cerebras SDK

## API Endpoints

- POST `/api/chat`: Send a message to the AI and get a response

## Environment Variables

- `CEREBRAS_API_KEY`: Your Cerebras API key
- `PORT`: Server port (default: 3000)

## Security Considerations

1. Never commit your `.env` file
2. Use HTTPS in production
3. Set up proper firewall rules
4. Keep dependencies updated

## Monitoring

For production monitoring, consider:
- PM2 monitoring
- Docker logs
- Server metrics
- API response times
