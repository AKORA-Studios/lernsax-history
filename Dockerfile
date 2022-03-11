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

# RUN addgroup -g 1001 -S nodejs \
#    && adduser -S nextjs -u 1001
#    && chsh -s /usr/sbin/nologin root \
#    && chown -R nextjs /app

# Install git as dependency
RUN apk fix
RUN apk --no-cache add \
    git=2.34.1-r0 \
    git-lfs=3.0.2-r0 \
    less=590-r0 \
    openssh=8.8_p1-r1 \
    rsync=3.2.3-r5 \
    && git lfs install

# Configure git
RUN git config --global user.email "git-history@lernsax.de" \
    && git config --global user.name "Git History Bot"

# Modules
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy all files -> KEEP .dockerignore UP TO DATE
COPY . .


# Compile
RUN npx swc src -d dist \
    && mkdir /app/files 

# Volumes
VOLUME [ "/app/git", "/app/files" ]

# Set UP cron job
RUN echo "node ./dist/index.js" > /app/start.sh \
    && chmod +x /app/start.sh \
    && touch /etc/crontabs/root \
    && echo "* */6 * * * /app/start.sh" > /etc/crontabs/root \
    && chown root:root /etc/crontabs/root

CMD [ "/usr/sbin/crond", "-f"]

#USER nextjs