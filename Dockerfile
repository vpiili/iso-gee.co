# build environment
FROM node:14.8.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY client/package.json ./
COPY client/package-lock.json ./
RUN npm ci --silent
COPY client ./
RUN npm run build

# production environment
FROM node:14.8.0-alpine
COPY --from=build /app/build /app/public
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY server/package.json ./
COPY server/index.js ./
RUN npm install --silent

EXPOSE 8000
CMD ["node", "index.js"]