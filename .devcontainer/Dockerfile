FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

ARG NODE_VERSION=18
ENV DEBIAN_FRONTEND=noninteractive
ENV NVM_DIR=/root/.nvm
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install common build tools, compilers and tools required for node-gyp and tree-sitter
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    ca-certificates curl build-essential git \
    python3 python3-distutils python3-dev \
    g++ make clang libclang-dev pkg-config cmake \
    libssl-dev libtool automake autoconf wget unzip \
 && rm -rf /var/lib/apt/lists/*

# Install nvm and the requested Node version (default: 18)
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
 && . $NVM_DIR/nvm.sh \
 && nvm install $NODE_VERSION \
 && nvm alias default $NODE_VERSION \
 && nvm use default \
 && npm install -g npm@latest

# Ensure node-gyp / npm use python3
RUN npm config set python /usr/bin/python3 || true

WORKDIR /workspace

CMD ["/bin/bash"]
