# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
ENV PORT=8080
EXPOSE 8080

# Bring the whole target directory and choose artifact at runtime
COPY --from=build /app/target /app/target

# Default command: find first JAR or WAR and run it
CMD ["sh","-c","set -e; ART=$(ls /app/target/*.jar 2>/dev/null | head -n1); if [ -z \"$ART\" ]; then ART=$(ls /app/target/*.war 2>/dev/null | head -n1); fi; if [ -z \"$ART\" ]; then echo 'No jar/war found under /app/target'; ls -la /app/target || true; exit 1; fi; echo Running: $ART; exec java -Dserver.port=${PORT} -jar \"$ART\""]
