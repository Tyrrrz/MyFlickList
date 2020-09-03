# ** Build

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src

COPY Directory.Build.props ./
COPY MyFlickList.Api MyFlickList.Api

RUN dotnet publish MyFlickList.Api -o MyFlickList.Api/artifacts -c Release

# ** Run

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS run
WORKDIR /app

EXPOSE 80
EXPOSE 443

COPY --from=build /src/MyFlickList.Api/artifacts ./

ENTRYPOINT ["dotnet", "MyFlickList.Api.dll"]