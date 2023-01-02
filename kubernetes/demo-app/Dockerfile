# --------------> The build image
FROM node:latest AS builder
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /app
COPY . . 
RUN npm ci && npm run build

# --------------> The production image
FROM node:16.17.0-bullseye-slim

ENV NODE_ENV production
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package*.json .
RUN npm ci --production
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
WORKDIR /app/dist
CMD ["dumb-init", "node", "app.js"]