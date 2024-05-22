FROM oven/bun

WORKDIR /workspace/bot
COPY package*.json ./
RUN bun install

COPY . .

RUN bun run start:prod --deploy
CMD ["sh", "-c", "bun run start:prod"]
