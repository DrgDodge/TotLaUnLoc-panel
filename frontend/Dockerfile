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

# [optional] tests & build
# Accept API_URL as a build argument
ARG API_URL
# Expose the build argument as an environment variable
ENV API_URL=$API_URL

ENV NODE_ENV=production
ENV PORT=5573
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
ENV NODE_ENV=production

COPY --from=prerelease /app/build build

# run the app
USER bun
EXPOSE 5573/tcp
ENTRYPOINT [ "bun", "run", "build/index.js" ]