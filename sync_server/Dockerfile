FROM rust:1.60.0-alpine AS builder
WORKDIR /usr/src/myapp
# RUN apk add \
#    pkgconfig \
#    openssl=1.1.1n-r0 \ 
#    openssl-dev=1.1.1n-r0
# gcc musl-dev rustup

COPY . .
# BuildKit -> --mount=type=cache,target=/usr/src/myapp/target 


RUN cargo install --path . 

FROM alpine:3.15 AS runner
WORKDIR /
RUN mkdir /files && mkdir /git 
ENV NODE_ENV production
ENV RUST_BACKTRACE 1
# ENV VERBOSE YES

# Install git as dependency
RUN apk fix
RUN apk --no-cache add \
    #    tini=0.19.0-r0  \
    git=2.34.1-r0 \
    git-lfs=3.0.2-r1 \
    less=590-r0 \
    openssh=8.8_p1-r1 \
    #     pkgconfig \
    #     openssl=1.1.1n-r0 \ 
    #     openssl-dev=1.1.1n-r0 \
    rsync=3.2.3-r5 \
    wget=1.21.2-r2 \
    ca-certificates=20211220-r0 \
    && git lfs install

# Configure git
RUN git config --global user.email "git-history@lernsax.de" \
    && git config --global user.name "Lernsax" \
    && git config --global pull.ff only

COPY --from=builder /usr/local/cargo/bin/lernsax-history /usr/local/bin/lernsax-history

# Volumes
VOLUME [ "/git", "/files" ]

# Set UP cron job
COPY ./cron /etc/crontabs/root
RUN chown root:root /etc/crontabs/root

# ENTRYPOINT [ "/sbin/tini","-vv", "--", "sh", "/app/start.sh" ]
#CMD [ "lernsax-history" ]
CMD [ "/usr/sbin/crond", "-f"]