FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm ts-node --project tsconfig.backend.json backend/ingest.ts
CMD ["pnpm","ts-node","--project","tsconfig.backend.json","backend/index.ts"]
EXPOSE 8787 