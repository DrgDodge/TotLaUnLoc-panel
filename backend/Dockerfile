# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS base
WORKDIR /app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

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

ENV NODE_ENV=production

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/index.ts .
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/.env.production .

# run the app
USER bun
EXPOSE 7355/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]