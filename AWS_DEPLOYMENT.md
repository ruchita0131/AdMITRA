# AWS EC2 Deployment Guide

## 1. Launch an EC2 Instance
- **AMI:** Ubuntu 24.04 LTS or Amazon Linux 2023
- **Instance Type:** t3.medium (Recommended for running Postgres + Redis + Java + Node simultaneously)
- **Security Group:**
  - Inbound rules: Open Port 22 (SSH), Port 80 (HTTP), Port 443 (HTTPS)

## 2. Install Docker & Docker Compose on EC2
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
newgrp docker
```

## 3. Clone and Run
```bash
git clone <your-repository-url>
cd admitra
# For production, you should override environment variables securely
docker-compose -f docker-compose.yml up -d --build
```

## 4. Setting up NGINX (Reverse Proxy)
To route domain traffic to your Docker containers, install NGINX on the EC2 host:
```bash
sudo apt-get install -y nginx
# Configure /etc/nginx/sites-available/default to proxy_pass to http://localhost:8080 for /api and http://localhost:3000 for frontend
sudo systemctl restart nginx
```
