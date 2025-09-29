FROM node:22.19-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY pnpm-lock.yaml ./
COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]