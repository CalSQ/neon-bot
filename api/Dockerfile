FROM oven/bun

RUN useradd -ms /bin/bash -u 1001 app

WORKDIR /app
COPY --chown=app:app . .
RUN bun install
RUN bun run build

CMD ["sh", "-c", "bun run start:${APP_ENVIRONMENT_CMD}"]
