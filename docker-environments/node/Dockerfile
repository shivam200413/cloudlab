FROM codercom/code-server:4.22.0

USER root

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs git zsh wget \
 && npm install -g yarn pnpm \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install oh-my-zsh for coder user
RUN su coder -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" || true

# VS Code extensions
RUN code-server --install-extension dbaeumer.vscode-eslint || true \
 && code-server --install-extension esbenp.prettier-vscode || true \
 && code-server --install-extension bradlc.vscode-tailwindcss || true

USER coder
WORKDIR /home/coder/project

RUN mkdir -p /home/coder/.config/code-server
COPY --chown=coder:coder config.yaml /home/coder/.config/code-server/config.yaml

EXPOSE 8080
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "/home/coder/project"]
