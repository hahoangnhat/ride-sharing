# ============== Build Stage ==============
FROM node:24-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY messages ./messages

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# ============== Production Stage ==============
FROM node:24-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/messages ./messages

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
