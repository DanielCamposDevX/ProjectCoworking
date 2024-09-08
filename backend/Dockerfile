FROM node:20

WORKDIR /usr/src/codi

COPY . .

RUN npm i
RUN npx prisma generate
RUN npm run build

