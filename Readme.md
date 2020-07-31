# 📺 MyFlickList

[![Build](https://github.com/Tyrrrz/MyFlickList/workflows/CI/badge.svg?branch=master)](https://github.com/Tyrrrz/MyFlickList/actions)
[![Coverage](https://codecov.io/gh/Tyrrrz/MyFlickList/branch/master/graph/badge.svg)](https://codecov.io/gh/Tyrrrz/MyFlickList)
[![Donate](https://img.shields.io/badge/donate-$$$-purple.svg)](https://tyrrrz.me/donate)

[MyFlickList](#) is a social cataloging platform where users can rate movies and TV shows they have watched, get recommendations, share their lists with friends, discuss related topics, and more. This website is inspired by similar projects, such as [MyAnimeList](https://myanimelist.net), [MyDramaList](https://mydramalist.com), and others.

## Local environment

To build and run MFL locally you will need the latest versions of [.NET SDK](https://dotnet.microsoft.com/download/dotnet-core), [Node](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/desktop).

### Running everything in Docker

The simplest way to run all services is via Docker Compose. To do that, use the `Run compose.ps1` script or execute the command inside manually.

Once the containers are running, you can access the app on `localhost:5000`, api on `localhost:5001`, and database on `localhost:5432`. 

### Running only database in Docker

When working on the project, it may be more convenient to run some of the services locally for debugging purposes, while relying on a database running in Docker. To do that, use the `Run compose (db only).ps1` script.

The database will be accessible on `localhost:5432`.