# Pulseboard — Personalized Content Dashboard

Pulseboard is a personalized content dashboard built with Next.js and Redux Toolkit. It brings content from live APIs into one interface and lets users search, filter, organize, and favorite content.

## Features

- Fetch news articles and movie information from APIs.
- Search and filter content.
- Customize content preferences.
- Save favorite items.
- Drag and drop to organize content cards.
- Dark mode.
- Persist user preferences and favorites locally.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **State Management:** Redux Toolkit, React Redux
- **APIs:** NewsAPI and TMDB
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Drag and Drop:** dnd-kit

## Prerequisites

- Node.js and npm
- API credentials for NewsAPI and TMDB

## Installation

Clone the repository:

```bash
git clone https://github.com/GaneshB-1098/pulseboard.git
cd pulseboard
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root:

```env
NEWS_API_KEY=your_news_api_key
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

Replace the placeholder values with your own API credentials. Do not commit `.env.local` to GitHub.

## Run the Project

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEWS_API_KEY` | Retrieves news articles |
| `TMDB_ACCESS_TOKEN` | Retrieves movie information |

## Future Improvements

- Add automated tests.
- Improve accessibility.
- Deploy the dashboard for public access.
