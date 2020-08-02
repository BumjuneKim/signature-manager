FROM node:12 AS builder

WORKDIR /home/signature-manager

COPY . .

RUN npm install
RUN npm run build

FROM node:12.18.3-alpine
ARG NODE_ENV=docker
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/signature-manager

COPY --from=builder /home/signature-manager ./

CMD ["npm", "run", "start:prod"]

