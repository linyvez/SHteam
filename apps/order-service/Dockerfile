FROM node:22.15.1-alpine
WORKDIR /app

COPY package*.json ./

COPY apps/order-service/package.json ./apps/order-service/
COPY packages/shared/package.json ./packages/shared/

RUN npm install

COPY apps/order-service ./apps/order-service
COPY packages/shared ./packages/shared

CMD ["npm", "run", "start:dev", "--prefix", "apps/order-service"]

