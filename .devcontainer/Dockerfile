FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-18

ENV DEBIAN_FRONTEND=noninteractive

# Install minimal packages required to build native Node modules (node-gyp)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
     ca-certificates curl build-essential git \
     python3 python3-distutils \
     g++ make \
 && rm -rf /var/lib/apt/lists/*

# Ensure node-gyp / npm use python3
RUN npm config set python /usr/bin/python3 || true

CMD ["/bin/bash"]
