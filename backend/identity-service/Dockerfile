# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Copy parent POM first
COPY pom.xml /app/
# Copy common module
COPY common /app/common
# Copy service module
COPY identity-service /app/identity-service
# Create dummy directories and POMs for other modules to satisfy Maven reactor
RUN for m in common serviceRegistry api-gateway identity-service venue-service booking-service payment-service community-service notification-service recommendation-service; do \
      mkdir -p $m && [ -f $m/pom.xml ] || echo '<project><modelVersion>4.0.0</modelVersion><groupId>com.badminton</groupId><artifactId>'"$m"'</artifactId><version>0.0.1-SNAPSHOT</version></project>' > $m/pom.xml; \
    done
# Build only this service
RUN mvn clean package -pl identity-service -am -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/identity-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
