## Installer & Runtime (better to split l8r)
FROM --platform=linux/amd64 node:18-alpine AS INSTALLER
WORKDIR /app
RUN apk update
COPY . .
RUN yarn global add pnpm
RUN pnpm fetch
RUN pnpm install -r --offline --frozen-lockfile
RUN pnpm build:server

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api-server
USER api-server
EXPOSE 3001
ENV NEXT_PUBLIC_NESTJS_SERVER http://localhost:3001
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "/app/apps/server/dist/main.js"]


## Runtime
# FROM --platform=linux/amd64 node:18-alpine AS RUNTIME
# RUN apk update
# WORKDIR /api
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 api-server
# USER api-server
# EXPOSE 3000
# ENV PORT 3000
# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=INSTALLER /app/apps/server/package.json /api/package.json
# # COPY --from=INSTALLER /app/node_modules ./node_modules
# COPY --from=INSTALLER /app/apps/server/node_modules /api/node_modules
# COPY --from=INSTALLER --chown=api-server:nodejs /app/apps/server/dist /api/

# CMD ["node", "/api/main.js"]