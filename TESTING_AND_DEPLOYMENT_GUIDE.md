# Testing & Deployment Guide - Badminton Platform

**Date:** May 21, 2026  
**Version:** 1.0

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Testing Strategy](#testing-strategy)
3. [API Testing Guide](#api-testing-guide)
4. [Database Setup](#database-setup)
5. [Service Startup Guide](#service-startup-guide)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Infrastructure Requirements
- [ ] PostgreSQL 16 with PostGIS extension installed
- [ ] MongoDB 7 running
- [ ] Redis 7 running
- [ ] Apache Kafka + Zookeeper running
- [ ] Java 21 installed
- [ ] Maven 3.8+ installed
- [ ] Node.js 18+ (for frontend)

### Database Setup
- [ ] PostgreSQL database `badminton_db` created
- [ ] Schemas created: `identity`, `venue`, `booking`, `payment`, `community`
- [ ] PostGIS extension enabled: `CREATE EXTENSION postgis;`
- [ ] MongoDB databases created: `notification_db`, `recommendation_db`
- [ ] Redis accessible on port 6379

### Kafka Topics
- [ ] `partner-onboarding` topic created
- [ ] `payment.events` topic created
- [ ] `booking.events` topic created
- [ ] `community.events` topic created

---

## 🧪 Testing Strategy

### 1. Unit Tests (Per Service)

#### Identity Service
```bash
cd backend/identity-service
mvn test
```

**Key Test Cases:**
- User registration with duplicate email
- Login with invalid credentials
- JWT token generation and validation
- OTP generation and expiration
- Password reset flow
- Admin user status update
- Admin role assignment

#### Community Service
```bash
cd backend/community-service
mvn test
```

**Key Test Cases:**
- Match post creation with validation
- Join match (OPEN vs APPROVAL mode)
- Approve/reject participant
- Capacity management (auto-close when full)
- Finish match and rating
- PostGIS nearby search
- Kafka event publishing

#### Notification Service
```bash
cd backend/notification-service
mvn test
```

**Key Test Cases:**
- Notification creation from events
- Mark as read functionality
- Unread count calculation
- Pagination
- Event deduplication

#### Recommendation Service
```bash
cd backend/recommendation-service
mvn test
```

**Key Test Cases:**
- Venue scoring algorithm
- Match scoring algorithm
- Redis caching
- User activity tracking
- External service integration

### 2. Integration Tests

#### Test Booking Flow
```bash
# 1. Lock slots
POST http://localhost:8080/api/bookings/locks
Headers: X-Auth-User-Id: {userId}
Body: {
  "venueId": "uuid",
  "courtId": "uuid",
  "slots": [{"startTime": "2026-05-22T18:00:00", "endTime": "2026-05-22T19:00:00"}]
}

# 2. Create booking
POST http://localhost:8080/api/bookings
Headers: X-Auth-User-Id: {userId}
Body: {"lockIds": ["uuid"]}

# 3. Create payment
POST http://localhost:8080/api/payments/create
Body: {"bookingId": "uuid", "userId": "uuid", "amount": 120000, "provider": "MOCK"}

# 4. Mock payment callback
POST http://localhost:8080/api/payments/mock/callback
Body: {"transactionId": "uuid", "result": "SUCCESS"}

# 5. Verify booking status changed to PAID
GET http://localhost:8080/api/bookings/{bookingId}

# 6. Verify notification created
GET http://localhost:8080/api/notifications/my
Headers: X-Auth-User-Id: {userId}
```

#### Test Community Flow
```bash
# 1. Create match post
POST http://localhost:8080/api/community/match-posts
Headers: X-Auth-User-Id: {hostId}
Body: {
  "title": "Tìm kèo tối nay",
  "level": "INTERMEDIATE",
  "startTime": "2026-05-22T19:00:00",
  "endTime": "2026-05-22T21:00:00",
  "locationText": "Sân ABC",
  "latitude": 21.03,
  "longitude": 105.81,
  "maxParticipants": 4,
  "joinMode": "APPROVAL"
}

# 2. User joins match
POST http://localhost:8080/api/community/match-posts/{matchId}/join
Headers: X-Auth-User-Id: {userId}, X-Auth-User-Name: "User Name"

# 3. Host approves participant
POST http://localhost:8080/api/community/match-posts/{matchId}/participants/{participantId}/approve
Headers: X-Auth-User-Id: {hostId}

# 4. Finish match
POST http://localhost:8080/api/community/match-posts/{matchId}/finish
Headers: X-Auth-User-Id: {hostId}

# 5. Rate player
POST http://localhost:8080/api/community/match-posts/{matchId}/ratings
Headers: X-Auth-User-Id: {hostId}
Body: {"rateeUserId": "uuid", "stars": 5, "comment": "Great player!"}

# 6. Verify notifications created
GET http://localhost:8080/api/notifications/my
Headers: X-Auth-User-Id: {userId}
```

### 3. E2E Tests

#### Scenario 1: New User Journey
1. Register → Login → Update Profile
2. Search nearby venues
3. View venue details and ratings
4. Lock slots → Create booking → Pay
5. Receive notification
6. Rate venue after booking

#### Scenario 2: Match Host Journey
1. Login as user
2. Create match post
3. Receive join requests
4. Approve participants
5. Finish match
6. Rate players

#### Scenario 3: Admin Journey
1. Login as admin
2. View pending venues
3. Approve/reject venues
4. View all users
5. Lock/unlock user accounts
6. View all bookings
7. Cancel booking

---

## 🔧 API Testing Guide

### Using Postman/Insomnia

#### 1. Import Environment Variables
```json
{
  "gateway_url": "http://localhost:8080",
  "identity_url": "http://localhost:8081",
  "venue_url": "http://localhost:8082",
  "booking_url": "http://localhost:8083",
  "payment_url": "http://localhost:8084",
  "community_url": "http://localhost:8085",
  "notification_url": "http://localhost:8086",
  "recommendation_url": "http://localhost:8087"
}
```

#### 2. Authentication Flow
```bash
# Register
POST {{gateway_url}}/api/v1/auth/register
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "Test@123",
  "fullName": "Test User",
  "phone": "0987654321"
}

# Login
POST {{gateway_url}}/api/v1/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "Test@123"
}

# Save accessToken from response
# Use in subsequent requests:
# Authorization: Bearer {{accessToken}}
# X-Auth-User-Id: {{userId}}
```

#### 3. Test Each Module

**Identity Module:**
- ✅ POST /api/v1/auth/register
- ✅ POST /api/v1/auth/login
- ✅ POST /api/v1/auth/refresh
- ✅ POST /api/v1/auth/logout
- ✅ POST /api/v1/auth/forgot-password
- ✅ POST /api/v1/auth/reset-password
- ✅ GET /api/v1/users/me
- ✅ PUT /api/v1/users/me
- ✅ GET /api/v1/admin/users (Admin only)
- ✅ PATCH /api/v1/admin/users/{userId}/status (Admin only)

**Venue Module:**
- ✅ GET /api/venues
- ✅ GET /api/venues/{id}
- ✅ GET /api/venues/nearby?lat=21.03&lng=105.81&radiusKm=5
- ✅ GET /api/venues/{venueId}/courts
- ✅ POST /api/venues/{venueId}/ratings
- ✅ GET /api/venues/{venueId}/ratings
- ✅ POST /api/venues (Owner)
- ✅ GET /api/admin/venues/pending (Admin)
- ✅ PATCH /api/admin/venues/{venueId}/approve (Admin)

**Booking Module:**
- ✅ POST /api/bookings/locks
- ✅ POST /api/bookings
- ✅ GET /api/bookings/my
- ✅ GET /api/bookings/{id}
- ✅ GET /api/owner/bookings (Owner)
- ✅ GET /api/owner/revenue (Owner)
- ✅ GET /api/admin/bookings (Admin)
- ✅ PATCH /api/admin/bookings/{id}/cancel (Admin)

**Payment Module:**
- ✅ POST /api/payments/create
- ✅ GET /api/payments/{transactionId}
- ✅ POST /api/payments/mock/callback

**Community Module:**
- ✅ POST /api/community/match-posts
- ✅ GET /api/community/match-posts
- ✅ GET /api/community/match-posts/nearby
- ✅ GET /api/community/match-posts/{id}
- ✅ POST /api/community/match-posts/{id}/join
- ✅ POST /api/community/match-posts/{id}/leave
- ✅ POST /api/community/match-posts/{id}/participants/{participantId}/approve
- ✅ POST /api/community/match-posts/{id}/close
- ✅ POST /api/community/match-posts/{id}/finish
- ✅ POST /api/community/match-posts/{id}/ratings

**Notification Module:**
- ✅ GET /api/notifications/my
- ✅ GET /api/notifications/unread-count
- ✅ PATCH /api/notifications/{id}/read
- ✅ PATCH /api/notifications/read-all

**Recommendation Module:**
- ✅ GET /api/recommendations/venues?lat=21.03&lng=105.81&radiusKm=10
- ✅ GET /api/recommendations/matches?lat=21.03&lng=105.81&radiusKm=10

---

## 💾 Database Setup

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE badminton_db;

-- Connect to database
\c badminton_db

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create schemas
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS venue;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS community;

-- Verify PostGIS
SELECT PostGIS_version();

-- Create initial admin user (run after identity service starts)
-- Password: Admin@123
INSERT INTO identity.users (id, email, password_hash, full_name, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@badminton.com',
  '$2a$10$YourHashedPasswordHere',
  'System Admin',
  'ACTIVE',
  NOW(),
  NOW()
);

-- Assign ADMIN role
INSERT INTO identity.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM identity.users u, identity.roles r
WHERE u.email = 'admin@badminton.com' AND r.code = 'ADMIN';
```

### MongoDB Setup

```javascript
// Connect to MongoDB
use notification_db

// Create indexes
db.notifications.createIndex({ "receiverId": 1, "createdAt": -1 })
db.notifications.createIndex({ "receiverId": 1, "readAt": 1 })

// Switch to recommendation database
use recommendation_db

// Create indexes
db.user_activities.createIndex({ "userId": 1 }, { unique: true })
db.user_activities.createIndex({ "updatedAt": 1 })
```

### Redis Setup

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Check Redis info
redis-cli info

# Monitor Redis commands (for debugging)
redis-cli monitor
```

---

## 🚀 Service Startup Guide

### 1. Start Infrastructure

```bash
# Start PostgreSQL
# Windows: Start from Services or pgAdmin
# Linux: sudo systemctl start postgresql

# Start MongoDB
# Windows: Start from Services
# Linux: sudo systemctl start mongod

# Start Redis
# Windows: Start from Services or redis-server.exe
# Linux: sudo systemctl start redis

# Start Kafka + Zookeeper
# Windows: Run from Kafka bin\windows folder
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
bin\windows\kafka-server-start.bat config\server.properties

# Linux:
bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties
```

### 2. Build All Services

```bash
cd backend
mvn clean install -DskipTests
```

### 3. Start Services in Order

```bash
# 1. Service Registry (Eureka)
cd serviceRegistry
mvn spring-boot:run
# Wait for: http://localhost:8761

# 2. Config Server
cd ../configServer
mvn spring-boot:run
# Wait for: http://localhost:8888

# 3. API Gateway
cd ../api-gateway
mvn spring-boot:run
# Wait for: http://localhost:8080

# 4. Identity Service
cd ../identity-service
mvn spring-boot:run
# Wait for: http://localhost:8081

# 5. Venue Service
cd ../venue-service
mvn spring-boot:run
# Wait for: http://localhost:8082

# 6. Booking Service
cd ../booking-service
mvn spring-boot:run
# Wait for: http://localhost:8083

# 7. Payment Service
cd ../payment-service
mvn spring-boot:run
# Wait for: http://localhost:8084

# 8. Community Service
cd ../community-service
mvn spring-boot:run
# Wait for: http://localhost:8085

# 9. Notification Service
cd ../notification-service
mvn spring-boot:run
# Wait for: http://localhost:8086

# 10. Recommendation Service
cd ../recommendation-service
mvn spring-boot:run
# Wait for: http://localhost:8087
```

### 4. Verify All Services

```bash
# Check Eureka Dashboard
http://localhost:8761

# Check Swagger UIs
http://localhost:8081/swagger-ui.html  # Identity
http://localhost:8082/swagger-ui.html  # Venue
http://localhost:8083/swagger-ui.html  # Booking
http://localhost:8084/swagger-ui.html  # Payment
http://localhost:8085/swagger-ui.html  # Community
http://localhost:8086/swagger-ui.html  # Notification
http://localhost:8087/swagger-ui.html  # Recommendation

# Test Gateway
http://localhost:8080/actuator/health
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Service Won't Start

**Problem:** Port already in use
```
Error: Port 8081 is already in use
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux
lsof -i :8081
kill -9 <PID>
```

#### 2. Database Connection Failed

**Problem:** Cannot connect to PostgreSQL
```
Error: Connection refused
```

**Solution:**
- Check PostgreSQL is running
- Verify connection string in application.yml
- Check firewall settings
- Verify username/password

#### 3. Kafka Connection Issues

**Problem:** Cannot connect to Kafka
```
Error: Connection to node -1 could not be established
```

**Solution:**
- Ensure Zookeeper is running first
- Check Kafka server.properties
- Verify bootstrap-servers in application.yml
- Check if topics are created

#### 4. PostGIS Extension Missing

**Problem:** PostGIS functions not found
```
Error: function st_dwithin does not exist
```

**Solution:**
```sql
-- Connect to database
\c badminton_db

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify
SELECT PostGIS_version();
```

#### 5. Redis Connection Failed

**Problem:** Cannot connect to Redis
```
Error: Unable to connect to Redis
```

**Solution:**
- Check Redis is running: `redis-cli ping`
- Verify Redis host/port in application.yml
- Check Redis password if configured

#### 6. Eureka Registration Failed

**Problem:** Service not showing in Eureka
```
Warn: DiscoveryClient_IDENTITY-SERVICE - registration failed
```

**Solution:**
- Check Eureka server is running
- Verify eureka.client.service-url.defaultZone
- Check network connectivity
- Wait 30-60 seconds for registration

---

## 📊 Monitoring & Logging

### Health Checks

```bash
# Check all services health
curl http://localhost:8080/actuator/health  # Gateway
curl http://localhost:8081/actuator/health  # Identity
curl http://localhost:8082/actuator/health  # Venue
# ... etc
```

### Log Locations

```
backend/identity-service/logs/
backend/venue-service/logs/
backend/booking-service/logs/
backend/payment-service/logs/
backend/community-service/logs/
backend/notification-service/logs/
backend/recommendation-service/logs/
```

### Kafka Monitoring

```bash
# List topics
bin/kafka-topics.sh --list --bootstrap-server localhost:9094

# Describe topic
bin/kafka-topics.sh --describe --topic community.events --bootstrap-server localhost:9094

# Consume messages (for debugging)
bin/kafka-console-consumer.sh --topic community.events --from-beginning --bootstrap-server localhost:9094
```

### Redis Monitoring

```bash
# Monitor all commands
redis-cli monitor

# Check memory usage
redis-cli info memory

# List all keys
redis-cli keys "*"

# Get specific key
redis-cli get "otp:test@example.com"
```

---

## 🎯 Performance Testing

### Load Testing with JMeter/k6

```javascript
// k6 script example
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  let res = http.get('http://localhost:8080/api/venues');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

### Expected Performance

- **Venue Search:** < 200ms (with PostGIS)
- **Booking Creation:** < 500ms
- **Payment Processing:** < 1s
- **Notification Delivery:** < 2s (async)
- **Recommendation:** < 300ms (with Redis cache)

---

## ✅ Production Readiness Checklist

### Security
- [ ] Change all default passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Implement API key authentication for internal services
- [ ] Secure Kafka with SASL/SSL
- [ ] Enable Redis password authentication

### Performance
- [ ] Configure connection pooling
- [ ] Enable database query caching
- [ ] Configure Redis eviction policy
- [ ] Set up CDN for static assets
- [ ] Enable GZIP compression

### Monitoring
- [ ] Set up application monitoring (Prometheus/Grafana)
- [ ] Configure log aggregation (ELK Stack)
- [ ] Set up alerting (PagerDuty/Slack)
- [ ] Enable distributed tracing (Zipkin/Jaeger)

### Backup & Recovery
- [ ] Configure PostgreSQL automated backups
- [ ] Configure MongoDB replica set
- [ ] Set up Redis persistence (AOF/RDB)
- [ ] Document disaster recovery procedures

---

**Last Updated:** May 21, 2026  
**Version:** 1.0  
**Status:** Ready for Testing
