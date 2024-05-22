FROM oven/bun

WORKDIR /api
COPY . .
RUN bun install
RUN bun run build

CMD ["sh", "-c", "bun run start:prod"]
