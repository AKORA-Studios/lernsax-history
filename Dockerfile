# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci -q




# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs\
    && adduser nextjs --gid 1001 
#    && chsh -s /usr/sbin/nologin root

# Install git as dependency
RUN apt-get -qq update && apt-get -y -qq install --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
#RUN npx -p typescript tsc

# You only need to copy next.config.js if you are NOT using the default configuration
COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY ./src ./src
#COPY --from=deps --chown=nextjs:nodejs /app/dist ./dist
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
# COPY --from=builder --chown=nextjs:nodejs /app/.env ./.env


EXPOSE 3000
ENV PORT 3000

RUN mkdir /app/files
VOLUME [ "/app/files" ]

# Show current folder structure in logs
#RUN ls -al -R -I "node_modules" -I "maps"  -I "dists"
USER nextjs
CMD [  "npx","ts-node",  "./dist/index.js" ]