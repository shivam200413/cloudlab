FROM codercom/code-server:4.22.0

USER root

RUN apt-get update && apt-get install -y \
    python3.11 python3.11-venv python3-pip \
    git zsh wget build-essential \
 && update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 \
 && update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1 \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir --break-system-packages \
    numpy pandas matplotlib seaborn scikit-learn \
    requests httpx fastapi uvicorn jupyter ipykernel

RUN code-server --install-extension ms-python.python || true \
 && code-server --install-extension ms-python.vscode-pylance || true

USER coder
WORKDIR /home/coder/project
RUN mkdir -p /home/coder/.config/code-server
COPY --chown=coder:coder config.yaml /home/coder/.config/code-server/config.yaml

EXPOSE 8080
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "/home/coder/project"]
