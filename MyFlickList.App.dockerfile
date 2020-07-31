# ** Build

FROM node:12 as build
WORKDIR /app

# React app can't access env vars after it's built
# so we need to set parameters before the build
ARG API_URL=http://localhost:5001/
ARG APP_URL=http://localhost:5000/

ENV REACT_APP_API_URL=${API_URL}
ENV PUBLIC_URL=${APP_URL}

COPY MyFlickList.App/package.json .
COPY MyFlickList.App/package-lock.json .

RUN npm install --silent

COPY MyFlickList.App/tsconfig.json .
COPY MyFlickList.App/public/ public/
COPY MyFlickList.App/src/ src/

RUN npm run build

# ** Run

FROM nginx:1.16.0 as run

EXPOSE 80
EXPOSE 443

RUN rm /etc/nginx/conf.d/default.conf
COPY MyFlickList.App/nginx/nginx.conf /etc/nginx/conf.d

COPY --from=build /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]