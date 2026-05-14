FROM node:22.15.1-alpine
WORKDIR /app

COPY package*.json ./

COPY apps/social-service/package.json ./apps/social-service/
COPY packages/shared/package.json ./packages/shared/

RUN npm install

COPY apps/social-service ./apps/social-service
COPY packages/shared ./packages/shared

CMD ["npm", "run", "start:dev", "--prefix", "apps/social-service"]