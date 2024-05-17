# ##### DEPENDENCIES

# FROM --platform=linux/amd64 node:18-alpine AS builder
# RUN apk update
# WORKDIR /app
# COPY . .



# ##### INSTALLER

# FROM --platform=linux/amd64 node:18-alpine AS installer
# RUN apk update
# WORKDIR /app

# COPY .gitignore .gitignore
# COPY --from=builder /app/apps/web ./apps/web
# COPY --from=builder /app/pnpm-lock.yaml\* ./

# RUN yarn global add pnpm && pnpm fetch && pnpm install --frozen-lockfile

# RUN pnpm build:web



# ##### RUNTIME

# FROM --platform=linux/amd64 node:18-alpine AS runner
# RUN apk update
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 client
# USER client
# EXPOSE 3000
# ENV PORT 3000

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=installer /app/apps/web/next.config.mjs ./
# COPY --from=installer /app/apps/web/package.json ./

# COPY --from=installer --chown=client:nodejs /app/apps/web/.next/standalone ./
# COPY --from=installer --chown=client:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# COPY --from=installer --chown=client:nodejs /app/apps/web/public ./apps/web/public

# CMD ["node", "apps/web/server.js"]


## Installer
FROM --platform=linux/amd64 node:18-alpine AS INSTALLER
WORKDIR /app
RUN apk update
COPY . .
RUN yarn global add pnpm
RUN pnpm fetch
RUN pnpm install -r --offline --frozen-lockfile
ENV NEXT_PUBLIC_NESTJS_SERVER http://localhost:3001
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build:web

CMD ["node", "/app/apps/web/.next/standalone/apps/web/server.js"]

## Runtime
# FROM --platform=linux/amd64 node:18-alpine AS RUNTIME
# RUN apk update
# WORKDIR /app
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 api-server
# USER api-server
# EXPOSE 3000
# ENV PORT 3000
# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=INSTALLER /app/apps/server/package.json ./package.json
# COPY --from=INSTALLER /app/node_modules ./node_modules
# COPY --from=INSTALLER --chown=api-server:nodejs /app/apps/server/dist ./dist

# CMD ["node", "dist/main.js"]
