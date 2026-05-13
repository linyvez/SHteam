FROM node:22.15.1-alpine
WORKDIR /app

COPY package*.json ./

COPY apps/identity-service/package.json ./apps/identity-service/
COPY packages/shared/package.json ./packages/shared/

RUN npm install

COPY apps/identity-service ./apps/identity-service
COPY packages/shared ./packages/shared

CMD ["npm", "run", "start:dev", "--prefix", "apps/identity-service"]
