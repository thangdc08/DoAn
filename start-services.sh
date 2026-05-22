#!/bin/bash

# Badminton Platform - Startup Script
# Starts all microservices in the correct order

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Badminton Platform Startup${NC}"
echo -e "${GREEN}================================${NC}"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0  # port is in use
    else
        return 1  # port is free
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service=$3
    local max_attempts=30
    local attempt=0

    echo -e "${YELLOW}Waiting for $service ($host:$port)...${NC}"

    while [ $attempt -lt $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            echo -e "${GREEN}✓ $service is ready${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done

    echo -e "${RED}✗ $service failed to start${NC}"
    return 1
}

# Check infrastructure services first
echo -e "\n${YELLOW}Checking Infrastructure Services...${NC}"

# Check PostgreSQL
if ! check_port 5432; then
    echo -e "${RED}PostgreSQL (port 5432) is not running!${NC}"
    echo "Please start PostgreSQL:"
    echo "  - Docker: docker start badminton-postgres"
    echo "  - Local: Start PostgreSQL service"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Check MongoDB
if ! check_port 27017; then
    echo -e "${RED}MongoDB (port 27017) is not running!${NC}"
    echo "Please start MongoDB"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"

# Check Redis
if ! check_port 6379; then
    echo -e "${RED}Redis (port 6379) is not running!${NC}"
    echo "Please start Redis"
    exit 1
fi
echo -e "${GREEN}✓ Redis is running${NC}"

# Check Kafka
if ! check_port 9094; then
    echo -e "${RED}Kafka (port 9094) is not running!${NC}"
    echo "Please start Kafka"
    exit 1
fi
echo -e "${GREEN}✓ Kafka is running${NC}"

# Start services in order
start_service() {
    local service_name=$1
    local port=$2
    local dir=$3
    local profile=${4:-"default"}

    echo -e "\n${YELLOW}Starting $service_name (port $port)...${NC}"

    if check_port "$port"; then
        echo -e "${YELLOW}⚠ $service_name already running on port $port${NC}"
        return 0
    fi

    cd "$SCRIPT_DIR/../backend/$dir"

    # Start in background
    if [ -f "mvnw" ]; then
        nohup ./mvnw spring-boot:run -Dspring-boot.run.profiles="$profile" > "/tmp/$service_name.log" 2>&1 &
    else
        nohup mvn spring-boot:run -Dspring-boot.run.profiles="$profile" > "/tmp/$service_name.log" 2>&1 &
    fi

    echo $! > "/tmp/$service_name.pid"

    # Wait for service to be ready
    if wait_for_service "localhost" "$port" "$service_name"; then
        echo -e "${GREEN}✓ $service_name started successfully${NC}"
        return 0
    else
        echo -e "${RED}✗ $service_name failed to start${NC}"
        echo "Check logs: tail -f /tmp/$service_name.log"
        return 1
    fi
}

# Start Service Registry (no profile needed)
start_service "Service Registry" 8761 "serviceRegistry" &

# Wait a bit for Eureka
sleep 5

# Config Server is disabled - removed from project
echo "Config Server is disabled (removed from project)"
echo

# Start Identity Service
start_service "Identity Service" 8081 "identity-service" "dev" &

# Start Venue Service
start_service "Venue Service" 8082 "venue-service" "dev" &

# Start Booking Service
start_service "Booking Service" 8083 "booking-service" "dev" &

# Start Payment Service
start_service "Payment Service" 8084 "payment-service" "dev" &

# Start Community Service
start_service "Community Service" 8085 "community-service" "dev" &

# Start Notification Service
start_service "Notification Service" 8086 "notification-service" "dev" &

# Start Recommendation Service
start_service "Recommendation Service" 8087 "recommendation-service" "dev" &

# Wait a bit
sleep 10

# Start API Gateway (needs all services up)
start_service "API Gateway" 8080 "api-gateway" "dev" &

# Note: Config Server (port 8888) is disabled

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}All services started!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Service URLs:"
echo "  API Gateway:        http://localhost:8080"
echo "  Service Registry:   http://localhost:8761"
echo "  Identity Service:   http://localhost:8081"
echo "  Venue Service:      http://localhost:8082"
echo "  Booking Service:    http://localhost:8083"
echo "  Payment Service:    http://localhost:8084"
echo "  Community Service:  http://localhost:8085"
echo "  Notification Service: http://localhost:8086"
echo "  Recommendation Service: http://localhost:8087"
echo ""
echo "To view logs: tail -f /tmp/<service-name>.log"
echo "To stop all: ./stop-services.sh"
echo ""
