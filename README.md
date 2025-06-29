# PalWorld Server Management Dashboard

A cyberpunk-styled dashboard for managing PalWorld game servers through their REST API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Server Monitoring**: Live metrics, player counts, and performance data
- **Player Management**: Kick, ban, and unban players with custom messages
- **Server Announcements**: Broadcast messages to all connected players
- **Historical Analytics**: Long-term metrics storage and performance charts
- **Settings Overview**: Complete server configuration display
- **Docker Ready**: Full containerization with PostgreSQL database

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your settings
3. Generate your base64 auth token:
   \`\`\`bash
   echo -n "username:password" | base64
   \`\`\`
4. Update `PALWORLD_AUTH_TOKEN` in your `.env` file
5. Run with Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

### Manual Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up your environment variables in `.env`

3. Set up the database:
   \`\`\`bash
   npx prisma db push
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Environment Variables

- `PALWORLD_API_URL`: Your PalWorld server API endpoint
- `PALWORLD_AUTH_TOKEN`: Base64 encoded username:password for API authentication
- `DATABASE_URL`: PostgreSQL connection string for metrics storage

## API Endpoints

The dashboard connects to these PalWorld API endpoints:
- `/v1/api/info` - Server information
- `/v1/api/metrics` - Performance metrics
- `/v1/api/players` - Player list
- `/v1/api/settings` - Server configuration
- `/v1/api/announce` - Send announcements
- `/v1/api/kick` - Kick players
- `/v1/api/ban` - Ban players
- `/v1/api/unban` - Unban players

## Deployment

### Portainer Stack

1. Create a new stack in Portainer
2. Copy the contents of `docker-compose.yml`
3. Set your environment variables
4. Deploy the stack

### Manual Docker

\`\`\`bash
docker build -t palworld-dashboard .
docker run -p 3000:3000 --env-file .env palworld-dashboard
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## License

MIT License - see LICENSE file for details
