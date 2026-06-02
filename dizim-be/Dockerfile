FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY tsconfig.json ./
COPY src/ ./src/

RUN yarn build

FROM node:22-alpine AS production

RUN apk add --no-cache tini

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

RUN mkdir -p /app/exports && chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 1337

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
