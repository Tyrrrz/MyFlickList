# 📺 MyFlickList

[![Build](https://github.com/Tyrrrz/MyFlickList/workflows/CI/badge.svg?branch=master)](https://github.com/Tyrrrz/MyFlickList/actions)
[![Coverage](https://codecov.io/gh/Tyrrrz/MyFlickList/branch/master/graph/badge.svg)](https://codecov.io/gh/Tyrrrz/MyFlickList)
[![Discord](https://img.shields.io/discord/740263153031446568)](https://discord.gg/hgVa7qS)
[![Donate](https://img.shields.io/badge/donate-$$$-purple.svg)](https://tyrrrz.me/donate)

**Under development!**

[MyFlickList](https://myflicklist.netlify.app) is a social cataloging platform where users can track movies and TV shows they have watched, leave reviews, get personal recommendations, share their lists with friends, discuss related topics, and many other things.

The goal is to provide a completely open and unified platform for everyone to express and share their tastes in movies, TV shows, anime, and other motion picture media, with a heavy emphasis on the social aspect of the process. Inspired by other projects, such as [MyAnimeList](https://myanimelist.net), [MyDramaList](https://mydramalist.com), [Letterboxd](https://letterboxd.com).

## Local environment

MyFlickList consists of 3 major components: Postgres database (`mfl.db`), ASP.NET Core REST API (`mfl.api`), and a React client (`mfl.app`). There are a few different ways to run them.

### Isolated setup (Docker)

Using Docker Compose, you can easily spin up MFL in a virtualized environment. This option works well if you just need to get everything running, but is not very suitable for iterative development due to lack of debugging and longer feedback loop.

Prerequisites:

- [Docker](https://docs.docker.com/desktop)

Steps:

- Change directory to repository root
- Build & run: `docker-compose up --build`

Individual containers should be exposed on the following ports:

- Database: `localhost:5432`
- API: `localhost:5000`
- App: `localhost:3000`

### Hybrid setup (Docker + local)

When actively working on the project, it's more convenient to run only the database in Docker, while having everything else running locally. This makes it possible to debug individual components and iterate more quickly.

Prerequisites:

- [Docker](https://docs.docker.com/desktop)
- [.NET SDK](https://dotnet.microsoft.com/download/dotnet-core)
- [Node](https://nodejs.org/en/download)

Steps:

- Run database: `docker-compose up mfl.db` (Terminal 1)
- Change directory to `/MyFlickList.Api` (Terminal 2)
- Run API: `dotnet run`
- Change directory to `/MyFlickList.App` (Terminal 3)
- Install node packages: `npm install`
- Run app: `npm start`

Individual containers should be exposed on the following ports:

- Database: `localhost:5432`
- API: `localhost:5000`
- App: `localhost:3000`

### Generate OpenAPI client

MyFlickList's API conforms with the OpenAPI standard, which is leveraged for automatic client generation. Whenever you make a change in the API, you will need to generate a new client so that frontend and backend stay in sync.

Steps:

- Ensure API project has been built
- Change directory to `/MyFlickList.App`
- Execute `npm run generate-client`

The generated client is placed in `src/infra/api.generated.ts`. Some editors may not load the type definitions immediately and you might need to open the file yourself to help.
