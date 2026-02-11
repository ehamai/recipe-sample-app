# Recipe Generator

A demo website that helps users generate AI-powered recipes based on ingredients they have on hand. Built with React, TypeScript, and the GitHub Copilot API.

## Features

- 🥗 **Ingredient Selection** - Browse ingredients by category or search for specific items
- 🤖 **AI Recipe Generation** - Get 8 recipe suggestions using GitHub Copilot
- 💡 **Smart Recommendations** - Each recipe includes suggestions to enhance the dish
- 🛒 **Shopping List** - Generate and print shopping lists for missing ingredients
- 💾 **Save Favorites** - Bookmark recipes to cook later
- 🔐 **GitHub Authentication** - Secure login via GitHub OAuth

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: In-memory (demo mode)
- **AI**: GitHub Copilot API
- **Auth**: GitHub OAuth via Passport.js

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- GitHub OAuth App credentials

## Quick Start (Node.js Backend)

### 1. Clone and navigate to the project

```bash
cd recipe-sample
```

### 2. Configure GitHub OAuth

Create a GitHub OAuth App:
- Go to GitHub > Settings > Developer Settings > OAuth Apps > New OAuth App
- Set Authorization callback URL to: `http://localhost:3000/api/auth/callback`

Create the server environment file:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your credentials:
```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=any_random_string_here
```

### 3. Install dependencies

```bash
cd server
npm install

cd ../ClientApp
npm install
```

### 4. Run the application (Development)

```bash
cd server
npm run dev
```

This starts both the backend (port 3000) and frontend (port 5173) with hot reloading.

Open http://localhost:5173

## Production Build

```bash
cd server
npm run build                    # Builds client + server
NODE_ENV=production npm start    # Serves everything on port 3000
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/login` | Initiate GitHub OAuth |
| GET | `/api/auth/user` | Get current user |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/ingredients` | List ingredients by category |
| POST | `/api/recipes/generate` | Generate recipes (auth required) |
| GET | `/api/recipes/saved` | Get saved recipes (auth required) |
| POST | `/api/recipes/saved` | Save a recipe (auth required) |
| DELETE | `/api/recipes/saved/{id}` | Delete saved recipe (auth required) |
| POST | `/api/shopping-list` | Generate shopping list |

## Project Structure

```
recipe-sample/
├── server/                     # Node.js/Express Backend
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic (Copilot API)
│   │   ├── models/             # TypeScript interfaces
│   │   ├── middleware/         # Auth middleware
│   │   ├── data/               # In-memory data store
│   │   └── app.ts              # Express app entry point
│   ├── package.json
│   └── tsconfig.json
├── ClientApp/                  # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React Context providers
│   │   └── types/              # TypeScript types
│   └── ...
├── wwwroot/                    # Built frontend assets
└── README.md
```

## License

MIT
