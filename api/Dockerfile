FROM node:alpine

# RUN useradd -ms /bin/bash -u 1001 app

WORKDIR /app
# COPY --chown=app:app . .
COPY . .
RUN npm install
RUN npm run build

CMD ["sh", "-c", "npm run start:${APP_ENVIRONMENT_CMD}"]
