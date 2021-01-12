FROM openjdk:11
COPY ./build/libs/ks-*.jar /ks-app.jar
CMD ["java", "-jar", "ks-app.jar"]
