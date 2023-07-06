FROM node:18-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder

WORKDIR /frontend

COPY . .
COPY --from=deps /frontend/node_modules ./node_modules

ARG NEXT_PUBLIC_MINIO_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SUPERSET_URL
ARG NEXT_HOP_UI
ARG NEXT_PRIVATE_BASE_URL

ENV NEXT_PRIVATE_BASE_URL=${NEXT_PRIVATE_BASE_URL}
ENV NEXT_PUBLIC_MINIO_URL=${NEXT_PUBLIC_MINIO_URL}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_SUPERSET_URL=${NEXT_PUBLIC_SUPERSET_URL}
ENV NEXT_HOP_UI=${NEXT_HOP_UI}

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner

RUN su root && apk add gettext

WORKDIR /frontend

ENV NODE_ENV production

COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/.next ./.next
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/package.json ./package.json
COPY --from=builder /frontend/next.config.js ./next.config.js

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /frontend/.next

EXPOSE 3000

CMD npm run start

# Dev image, copy all the files and run next
FROM node:18-alpine AS dev

RUN su root && apk add gettext

WORKDIR /frontend

ENV NODE_ENV development
COPY --from=builder /frontend ./

EXPOSE 3000

CMD npm run dev