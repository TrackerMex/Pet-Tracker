# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS deps
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
COPY --from=build --chmod=0444 /app/certs/rds-global-bundle.pem /app/rds-global-bundle.pem
ENV NODE_EXTRA_CA_CERTS=/app/rds-global-bundle.pem
COPY --from=build /app/src/db/migrations ./dist/src/db/migrations
USER node
CMD ["node", "dist/src/main.js"]
