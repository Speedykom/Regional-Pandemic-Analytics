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
COPY --from=builder /frontend/entrypoint.sh ./entrypoint.sh
COPY --from=builder /frontend/next.config.template.js ./next.config.template.js

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /frontend/.next
RUN chmod +x /frontend/entrypoint.sh

EXPOSE 3000

RUN npx next telemetry disable

ENTRYPOINT ["/bin/sh","/frontend/entrypoint.sh"]

CMD npm run start



# Dev image, copy all the files and run next
FROM node:18-alpine AS dev

RUN su root && apk add gettext

WORKDIR /frontend

ENV NODE_ENV development
COPY --from=builder /frontend ./

RUN chmod +x /frontend/entrypoint.sh

EXPOSE 3000

RUN npx next telemetry disable

ENTRYPOINT ["/bin/sh","/frontend/entrypoint.sh"]

CMD npm run dev