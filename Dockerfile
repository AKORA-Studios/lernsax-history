# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat=1.2.2-r7
WORKDIR /app
COPY package*.json ./
RUN npm ci -q \
    && npm i -D @swc/core-linux-musl



# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001
#    && chsh -s /usr/sbin/nologin root

# Install git as dependency
RUN apk fix
RUN apk --update add git git-lfs less openssh && \
    git lfs install && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*


# Modules
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# You only need to copy next.config.js if you are NOT using the default configuration
COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY ./src ./src
# Compile
RUN npx swc src -d dist

# Volumes
VOLUME [ "/app/git" ]
RUN mkdir /app/files
VOLUME [ "/app/files" ]

# Show current folder structure in logs
#RUN ls -al -R -I "node_modules" -I "maps"  -I "dists"
USER nextjs
CMD [  "node",  "./dist/index.js" ]