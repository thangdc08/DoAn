# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# Copy parent POM first
COPY pom.xml /app/
# Copy common module
COPY common /app/common
# Copy serviceRegistry module
COPY serviceRegistry /app/serviceRegistry
# Build only this service
RUN mvn clean package -pl serviceRegistry -am -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/serviceRegistry/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
