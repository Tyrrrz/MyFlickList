# 📺 MyFlickList

[![Build](https://github.com/Tyrrrz/MyFlickList/workflows/CI/badge.svg?branch=master)](https://github.com/Tyrrrz/MyFlickList/actions)
[![Coverage](https://codecov.io/gh/Tyrrrz/MyFlickList/branch/master/graph/badge.svg)](https://codecov.io/gh/Tyrrrz/MyFlickList)
[![Donate](https://img.shields.io/badge/donate-$$$-purple.svg)](https://tyrrrz.me/donate)

[MyFlickList](#) is a social cataloging platform where users can rate movies and TV shows they have watched, get recommendations, share their lists with friends, discuss related topics, and more. This website is inspired by similar projects, such as [MyAnimeList](https://myanimelist.net), [MyDramaList](https://mydramalist.com), and others.

## Local environment

To build and run MFL locally you will need the latest versions of [.NET SDK](https://dotnet.microsoft.com/download/dotnet-core), [Node](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/desktop).

### Running in Docker

To run all services in Docker, use Docker Compose. You can use the `Run compose.ps1` script to do it.

Once the containers are running, the app will be on `localhost:3000`, API on `localhost:5000`, and database on `localhost:5432`.

### Running in Docker (database only)

Sometimes it's more convenient to run only the database in Docker and then debug the other services directly. You can use the `Run compose (db only).ps1` script to do that.

The database will be on `localhost:5432`.

### Running the API on host

- Change directory to `MyFlickList.Api`
- Execute `dotnet run`

The API will be on `localhost:5000`.

### Running the app on host

- Change directory to `MyFlickList.App`
- Execute `npm install`
- Execute `npm start`

The app will be on `localhost:3000`.
