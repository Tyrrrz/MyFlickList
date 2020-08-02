# 📺 MyFlickList

[![Build](https://github.com/Tyrrrz/MyFlickList/workflows/CI/badge.svg?branch=master)](https://github.com/Tyrrrz/MyFlickList/actions)
[![Coverage](https://codecov.io/gh/Tyrrrz/MyFlickList/branch/master/graph/badge.svg)](https://codecov.io/gh/Tyrrrz/MyFlickList)
[![Donate](https://img.shields.io/badge/donate-$$$-purple.svg)](https://tyrrrz.me/donate)

[MyFlickList](https://myflicklist.netlify.app) is a social cataloging platform where users can rate movies and TV shows they have watched, get recommendations, share their lists with friends, discuss related topics, and more. This website is inspired by similar projects, such as [MyAnimeList](https://myanimelist.net), [MyDramaList](https://mydramalist.com), and others.

## Local environment

To work on MFL locally you will need the latest versions of [.NET SDK](https://dotnet.microsoft.com/download/dotnet-core), [Node](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/desktop).

### Run the database

- Execute `docker-compose up mfl.db --build`

The database will be available on `localhost:5432`.

### Run the API

- Change directory to `MyFlickList.Api`
- Execute `dotnet run`

The API will be available on `localhost:5000`.

### Run the app

- Change directory to `MyFlickList.App`
- Execute `npm install` (if first time or if `package.json` was changed)
- Execute `npm start`

The app will be on `localhost:3000`.

### Run everything together

- Execute `docker-compose up --build`

The database will be available on `localhost:5432`.
The API will be available on `localhost:5000`.
The app will be on `localhost:3000`.

### Generate OpenAPI client

- [Run the API](#Run-the-api)
- Change directory to `MyFlickList.App`
- Execute `npm run update-client`

The generated client is placed in `src/infra/api.generated.ts`.
