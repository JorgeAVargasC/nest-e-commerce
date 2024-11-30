#* ============ Dependencies ============ #
FROM node:21-alpine3.19 AS deps
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn


#* ============ Builder ============ #
FROM node:21-alpine3.19 AS build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN yarn build
RUN yarn install --frozen-lockfile -f --only=production && yarn cache clean --force


#* ============ Create final image ============ #
FROM node:21-alpine3.19 AS prod
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]

