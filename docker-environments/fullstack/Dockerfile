FROM codercom/code-server:4.22.0

USER root

# Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g yarn pnpm

# Python 3.11 + tools
RUN apt-get update && apt-get install -y \
    python3.11 python3.11-venv python3-pip \
    git zsh wget postgresql-client redis-tools build-essential \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --break-system-packages fastapi uvicorn requests httpx sqlalchemy psycopg2-binary

# Extensions
RUN code-server --install-extension dbaeumer.vscode-eslint || true \
 && code-server --install-extension ms-python.python || true

USER coder
WORKDIR /home/coder/project
RUN mkdir -p /home/coder/.config/code-server
COPY --chown=coder:coder config.yaml /home/coder/.config/code-server/config.yaml

EXPOSE 8080
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "/home/coder/project"]
