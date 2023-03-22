# From tomcat:jdk11-temurin-jammy
# RUN rm -rf /usr/local/tomcat/webapps/*
# COPY ./target/Maitinimas-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war
# CMD ["catalina.sh","run"]

FROM maven:3.8.5-openjdk-11 AS MAVEN_BUILD
ENV SPRING_RECAPTCHA_SECRET_KEY=6LfQD1IjAAAAADutAZjCiP-IGU-jVHbyw1SGR6d4
ENV REACT_RECAPTCHA_SITE_KEY=6LfQD1IjAAAAABG-dSaxBdzJKgDQh7_vPDHmIy0-
COPY pom.xml /build/
COPY mvnw /build/
COPY .mvn /build/.mvn
COPY src /build/src/
WORKDIR /build/
RUN mvn clean install -Dmaven.test.skip=true

FROM tomcat:jdk11-temurin-jammy
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=MAVEN_BUILD /build/target/Maitinimas-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/
ENTRYPOINT ["catalina.sh","run"]