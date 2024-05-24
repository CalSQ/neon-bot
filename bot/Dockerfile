FROM oven/bun

RUN useradd -ms /bin/bash -u 1001 app

WORKDIR /app
COPY package*.json ./
RUN bun install

COPY --chown=app:app ./src ./src
CMD ["sh", "-c", "bun run start:${APP_ENVIRONMENT_CMD}"]
