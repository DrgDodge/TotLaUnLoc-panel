# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS base
WORKDIR /app
ARG PB_VERSION=0.28.4

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN \
  mkdir -p /temp/dev && \
  mkdir -p /temp/pb && \
  apk add --no-cache unzip ca-certificates
COPY package.json bun.lock /temp/dev/
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb/pb.zip

RUN \
  cd /temp/dev && \
  bun install --frozen-lockfile && \
  cd /tmp/pb && \
  unzip /tmp/pb/pb.zip -d /app/db

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# copy production dependencies and source code into final image
FROM base AS release

RUN /app/db/pocketbase superuser upsert $SUPERUSER_EMAIL $SUPERUSER_PASSWORD

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/index.ts .
COPY --from=prerelease /app/package.json .

CMD ["db/pocketbase", "serve", "--http=0.0.0.0:8080"]

# run the app
USER bun
EXPOSE 7355/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]