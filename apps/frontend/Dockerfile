FROM node:22.15.1-alpine
WORKDIR /app

COPY package*.json ./

COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

RUN npm install

COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared

CMD ["npm", "run", "dev", "--prefix", "apps/frontend"]

