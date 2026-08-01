# Build stage
FROM rust:1.80-slim as builder
WORKDIR /app

# Create a new empty shell project
RUN cargo new --bin proxy
WORKDIR /app/proxy

# Copy our manifests
COPY Cargo.toml Cargo.lock ./

# Build only the dependencies to cache them
RUN cargo build --release
RUN rm src/*.rs

# Copy the source code
COPY src ./src

# Build for release. Touch main.rs to ensure it's rebuilt
RUN rm ./target/release/deps/antigravity_proxy*
RUN cargo build --release

# Final runtime stage
FROM debian:bookworm-slim
WORKDIR /app

# Install dependencies (reqwest needs libssl)
RUN apt-get update && \
    apt-get install -y ca-certificates libssl3 && \
    rm -rf /var/lib/apt/lists/*

# Copy the build artifact from the build stage
COPY --from=builder /app/proxy/target/release/antigravity-proxy /app/antigravity-proxy

EXPOSE 8080

# Run the binary
CMD ["/app/antigravity-proxy"]
