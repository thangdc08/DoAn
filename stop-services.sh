#!/bin/bash

# Badminton Platform - Stop Services Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping all badminton platform services..."

# Services to stop
SERVICES=(
    "api-gateway"
    "recommendation-service"
    "notification-service"
    "community-service"
    "payment-service"
    "booking-service"
    "venue-service"
    "identity-service"
    "service-registry"
)

# Kill processes by PID files
for service in "${SERVICES[@]}"; do
    pid_file="/tmp/${service}.pid"
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            echo "Stopping $service (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            sleep 2
            # Force kill if still running
            if ps -p "$pid" > /dev/null 2>&1; then
                kill -9 "$pid" 2>/dev/null || true
            fi
        fi
        rm -f "$pid_file"
    fi
done

# Fallback: Kill by process name pattern
echo "Cleaning up remaining processes..."
pkill -f "badminton-platform" 2>/dev/null || true

echo "All services stopped."
