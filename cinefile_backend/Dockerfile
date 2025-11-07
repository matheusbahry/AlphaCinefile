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
# Copy both jar or war (whichever was produced)
COPY --from=build /app/target/*.jar /app/app.jar 2>/dev/null || true
COPY --from=build /app/target/*.war /app/app.war 2>/dev/null || true

# Default command selects the built artifact dynamically
CMD ["sh","-c","set -e; ART=\"\"; if [ -f /app/app.jar ]; then ART=/app/app.jar; elif [ -f /app/app.war ]; then ART=/app/app.war; else echo 'No app artifact found (jar/war)' && exit 1; fi; exec java -Dserver.port=${PORT} -jar \"$ART\""]
