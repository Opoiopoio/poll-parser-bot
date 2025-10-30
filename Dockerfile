FROM node:22-bullseye

# RUN npm install -g yarn

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile \
  && yarn prisma migrate deploy \
  && yarn build

RUN rm -r ./src

CMD ["node", "dist/main.js"]