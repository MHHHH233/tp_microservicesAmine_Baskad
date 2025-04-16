
# tp_microservicesAmine_Baskad
1 - npm i
2 node Produit.js   node index.js node commande.js


# Docker Commands Cheat Sheet

## Container Management
| Command | Description |
|---------|-------------|
| `docker run <image>` | Run a container from an image |
| `docker run -d <image>` | Run in detached (background) mode |
| `docker run -it <image> sh` | Run interactively with a shell |
| `docker run --name <name> <image>` | Assign a custom name to the container |
| `docker run -p 8080:80 <image>` | Map host port 8080 to container port 80 |
| `docker run -v /host/path:/container/path <image>` | Mount a volume |
| `docker start <container>` | Start a stopped container |
| `docker stop <container>` | Stop a running container gracefully |
| `docker restart <container>` | Restart a container |
| `docker pause <container>` | Pause all processes in a container |
| `docker unpause <container>` | Unpause a paused container |
| `docker rm <container>` | Remove a stopped container |
| `docker rm -f <container>` | Force remove a running container |
| `docker exec -it <container> sh` | Open a shell in a running container |
| `docker logs <container>` | View container logs |
| `docker logs -f <container>` | Follow logs in real-time |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers (including stopped) |

## Image Management
| Command | Description |
|---------|-------------|
| `docker images` | List all local images |
| `docker pull <image>` | Download an image from a registry |
| `docker build -t <tag> .` | Build an image from a Dockerfile |
| `docker rmi <image>` | Remove an image |
| `docker push <image>` | Push an image to a registry |
| `docker save <image> > file.tar` | Save an image to a tar file |
| `docker load < file.tar` | Load an image from a tar file |

## Network Management
| Command | Description |
|---------|-------------|
| `docker network ls` | List all networks |
| `docker network create <name>` | Create a new network |
| `docker network inspect <network>` | Inspect a network |
| `docker network connect <network> <container>` | Connect a container to a network |
| `docker network disconnect <network> <container>` | Disconnect a container |

## Volume Management
| Command | Description |
|---------|-------------|
| `docker volume ls` | List all volumes |
| `docker volume create <name>` | Create a new volume |
| `docker volume inspect <volume>` | Inspect a volume |
| `docker volume rm <volume>` | Remove a volume |

## System & Cleanup
| Command | Description |
|---------|-------------|
| `docker info` | Display system-wide information |
| `docker stats` | Show live resource usage statistics |
| `docker system prune` | Remove unused data (containers, networks, etc.) |
| `docker system prune -a` | Remove all unused images too |
| `docker version` | Show Docker version information |

## Docker Compose
| Command | Description |
|---------|-------------|
| `docker-compose up` | Start services defined in `docker-compose.yml` |
| `docker-compose up -d` | Start services in detached mode |
| `docker-compose down` | Stop and remove containers, networks |
| `docker-compose logs` | View logs from all services |
| `docker-compose ps` | List running compose services |