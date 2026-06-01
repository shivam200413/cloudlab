# ☁️ CloudLab — Personal Cloud Coding Environment

A self-hosted, browser-based coding workspace platform built on AWS Free Tier. Spin up VS Code (code-server) environments in seconds from a sleek dark-mode dashboard.

<img width="1910" height="878" alt="Screenshot 2026-06-01 112759" src="https://github.com/user-attachments/assets/da4507a8-6ac9-401d-956a-5189cc88c672" />
<img width="1915" height="865" alt="Screenshot 2026-06-01 112818" src="https://github.com/user-attachments/assets/0e6372be-f93b-436e-8d4a-28d564c52915" />
<img width="1131" height="867" alt="Screenshot 2026-06-01 112842" src="https://github.com/user-attachments/assets/2a00fe9c-cd36-4278-b772-95ac35e6449d" />



![CloudLab Dashboard](https://img.shields.io/badge/Status-Live-00d4d4?style=for-the-badge)
![AWS Free Tier](https://img.shields.io/badge/AWS-Free%20Tier-orange?style=for-the-badge&logo=amazon-aws)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)

## Features

- **Browser-based VS Code** — Full code-server IDE in your browser
- **3 environment templates** — Node.js 20, Python 3.11, Full Stack
- **Real-time dashboard** — Live CPU/RAM stats per workspace
- **AWS Free Tier** — Runs entirely within AWS free limits
- **JWT authentication** — Secure login system
- **Dark mode UI** — Sleek teal/dark aesthetic

## Architecture
## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, Dockerode |
| Workspaces | code-server (VS Code in browser) |
| Auth | JWT + bcrypt |
| Proxy | Nginx |
| Cloud | AWS EC2 t2.micro + EBS 30GB |
| Containers | Docker + Docker Compose |

## Quick Start (Local)

### Prerequisites
- Docker Desktop installed and running
- Git

### Run locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/cloudlab.git
cd cloudlab

# Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Build workspace images (10-15 min first time)
docker build -t cloudlab-node:latest ./docker-environments/node
docker build -t cloudlab-python:latest ./docker-environments/python
docker build -t cloudlab-fullstack:latest ./docker-environments/fullstack

# Start the platform
docker compose up --build -d

# Open http://localhost
# Login: admin@cloudlab.local / cloudlab123
```

## AWS EC2 Deployment (Free Tier)

### 1. Launch EC2 Instance
- AMI: Ubuntu 24.04 LTS (Free tier eligible)
- Instance type: t2.micro or t3.micro (Free tier eligible)
- Storage: 30 GB gp2
- Open ports: 22, 80, 4000, 8100-8200

### 2. Install Docker on EC2
```bash
sudo apt-get update && sudo apt-get upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
sudo apt-get install -y docker-compose-plugin git unzip
newgrp docker
```

### 3. Add swap memory
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4. Deploy
```bash
git clone https://github.com/YOUR_USERNAME/cloudlab.git
cd cloudlab
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Edit with your EC2 IP
nano backend/.env        # Set FRONTEND_URL=http://YOUR_EC2_IP
nano frontend/.env.local # Set NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:4000

# Build and start
docker build -t cloudlab-node:latest ./docker-environments/node
docker build -t cloudlab-python:latest ./docker-environments/python
docker build -t cloudlab-fullstack:latest ./docker-environments/fullstack
docker compose up --build -d
```

Open `http://YOUR_EC2_IP` in your browser.

## Environment Variables

### backend/.env
```env
PORT=4000
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourpassword
CODE_SERVER_PASSWORD=youridepassword
FRONTEND_URL=http://your-ec2-ip
NODE_ENV=production
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://your-ec2-ip:4000
```

## Project Structure
## AWS Free Tier Cost

| Service | Free Limit | After Free Tier |
|---------|-----------|-----------------|
| EC2 t2.micro | 750 hrs/month | ~$8.50/month |
| EBS Storage | 30 GB | ~$3.00/month |
| Data Transfer | 100 GB/month | $0.09/GB |

## License

MIT — feel free to use, modify, and deploy.

---

Built with Next.js, Node.js, Docker, and AWS Free Tier.
