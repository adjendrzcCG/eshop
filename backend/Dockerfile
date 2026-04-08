FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S eshop && adduser -S eshop -G eshop
COPY --from=builder /app/target/eshop-backend-*.jar app.jar
RUN mkdir -p /app/uploads && chown -R eshop:eshop /app
USER eshop
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
