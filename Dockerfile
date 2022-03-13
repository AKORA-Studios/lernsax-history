FROM rust:1.59.0-alpine AS builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path . \
    &&  ls /usr/local/

FROM alpine:3.15.0 AS runner
WORKDIR /
RUN mkdir /files && mkdir /git 
ENV NODE_ENV production

# Install git as dependency
RUN apk fix
RUN apk --no-cache add \
    #    tini=0.19.0-r0  \
    git=2.34.1-r0 \
    git-lfs=3.0.2-r0 \
    less=590-r0 \
    openssh=8.8_p1-r1 \
    rsync=3.2.3-r5 \
    && git lfs install

# Configure git
RUN git config --global user.email "git-history@lernsax.de" \
    && git config --global user.name "Git History Bot" \
    && git config --global pull.ff only

COPY --from=builder /usr/local/cargo/bin/lernsax-history /usr/local/bin/lernsax-history

# Volumes
VOLUME [ "/git", "/files" ]

# Set UP cron job
#COPY ./start.sh ./start.sh
COPY ./cron /etc/crontabs/root
#RUN chmod +x /app/start.sh \
RUN chown root:root /etc/crontabs/root



# ENTRYPOINT [ "/sbin/tini","-vv", "--", "sh", "/app/start.sh" ]
CMD [ "lernsax-history" ]
#CMD [ "/usr/sbin/crond", "-f"]