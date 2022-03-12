FROM deno:1.19.2 AS runner
WORKDIR /app

ENV NODE_ENV production

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
COPY ./src/deps.ts ./src/deps.ts
RUN deno cache ./src/deps.ts

# Copy all files -> KEEP .dockerignore UP TO DATE
COPY ./src ./src

# Volumes
VOLUME [ "/app/git", "/app/files" ]

# Set UP cron job
COPY ./start.sh ./start.sh
COPY ./cron /etc/crontabs/root
RUN chmod +x /app/start.sh \
    && chown root:root /etc/crontabs/root

CMD [ "/usr/sbin/crond", "-f"]