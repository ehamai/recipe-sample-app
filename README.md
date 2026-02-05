# Recipe Generator

A demo website that helps users generate AI-powered recipes based on ingredients they have on hand. Built with React, .NET 8, and the GitHub Copilot SDK.

## Features

- 🥗 **Ingredient Selection** - Browse ingredients by category or search for specific items
- 🤖 **AI Recipe Generation** - Get 3 recipe suggestions using GitHub Copilot
- 💡 **Smart Recommendations** - Each recipe includes suggestions to enhance the dish
- 🛒 **Shopping List** - Generate and print shopping lists for missing ingredients
- 💾 **Save Favorites** - Bookmark recipes to cook later
- 🔐 **GitHub Authentication** - Secure login via GitHub OAuth

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: .NET 8, ASP.NET Core
- **Database**: PostgreSQL (via Docker)
- **AI**: GitHub Copilot SDK
- **Auth**: GitHub OAuth

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- GitHub OAuth App credentials

## Setup

### 1. Clone and navigate to the project

```bash
cd recipe-sample
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Configure environment

Copy the example environment file and add your GitHub OAuth credentials:

```bash
cp .env.example .env
```

Edit `.env` with your GitHub OAuth App credentials:
- Go to GitHub > Settings > Developer Settings > OAuth Apps > New OAuth App
- Set Authorization callback URL to: `http://localhost:5123/api/auth/callback`

Update `RecipeApp/appsettings.Development.json`:
```json
{
  "GitHub": {
    "ClientId": "your_client_id",
    "ClientSecret": "your_client_secret"
  }
}
```

### 4. Run database migrations

```bash
cd RecipeApp
dotnet ef migrations add InitialCreate
dotnet ef database update
```

> Note: If you don't have EF tools, install with: `dotnet tool install --global dotnet-ef`

### 5. Install frontend dependencies

```bash
cd ClientApp
npm install
```

## Running the Application

### Development Mode (recommended)

Run frontend and backend separately for hot reloading:

**Terminal 1 - Backend:**
```bash
cd RecipeApp
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd RecipeApp/ClientApp
npm run dev
```

Open http://localhost:5173

### Production Mode

Build and run as a single application:

```bash
# Build the frontend
cd RecipeApp/ClientApp
npm run build

# Run the backend (serves the built frontend)
cd ..
dotnet run --configuration Release --launch-profile http
```

Open http://localhost:5123

> **Note:** The `--launch-profile http` uses your development credentials from `appsettings.Development.json`. For a true production deployment, use `--launch-profile production` and configure credentials in `appsettings.json`.

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
├── RecipeApp/                  # .NET Backend
│   ├── Controllers/            # API Controllers
│   ├── Services/               # Business Logic
│   ├── Models/                 # Data Models
│   ├── Data/                   # EF Core DbContext
│   ├── ClientApp/              # React Frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Page components
│   │   │   ├── context/        # React Context providers
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── types/          # TypeScript types
│   │   └── ...
│   └── Program.cs              # App configuration
├── docker-compose.yml          # PostgreSQL container
└── README.md
```

## License

MIT
