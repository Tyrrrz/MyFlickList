# 📺 MyFlickList

[![Build](https://github.com/Tyrrrz/MyFlickList/workflows/CI/badge.svg?branch=master)](https://github.com/Tyrrrz/MyFlickList/actions)
[![Coverage](https://codecov.io/gh/Tyrrrz/MyFlickList/branch/master/graph/badge.svg)](https://codecov.io/gh/Tyrrrz/MyFlickList)
[![Donate](https://img.shields.io/badge/donate-$$$-purple.svg)](https://tyrrrz.me/donate)

[MyFlickList](#) is a social cataloging platform where users can rate movies and TV shows they have watched, get recommendations, share their lists with friends, discuss related topics, and more. This website is inspired by similar projects, such as [MyAnimeList](https://myanimelist.net), [MyDramaList](https://mydramalist.com), and others.

## Building locally

To build and run MFL locally you will need the latest versions of [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core), [Node](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/desktop).

### Running everything together

The simplest way to run the frontend, backend, and all their dependencies is via Docker Compose. To do that, run the following command in repository root:

```sh
docker-compose up --build
```

Once the containers are running, you can access the frontend on `localhost:5000` and backend on `localhost:5001`.
