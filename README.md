To run and test the program you might consider doing the following:

1. install and run docker on your computer;

2 .in terminal (terminal 1) run: "git checkout dev_task2";

3. in terminal run: "npm i";

4. rename .env.example file to .env;

5. make sure that you have no other docker containers/images nor servers running, especially on ports 4000 and 5432;

6. in terminal run: "docker-compose up --build". It might take a while, but eventually you shall see greenish logs - the app has started (+30 Local PostgreSQL installation is not required for task check, connection is implemented to database stored in docker container);

7. in separate terminal window (terminal 2) run: "npm run lint"; Should be no detected errors;

8. in terminal 2 run: "npm run scan"; This scans for vulnerabilities (+10 Implemented npm script for vulnerabilities scanning (free solution)). You have to be logged in Docker to use this scan (in terminal 2 run "docker login");
   There are vulnerabilities since the assignment only requires to scan but not to eliminate them;

9. in terminal 2 run: "npm run test"; 67/67 tests should be passed;

10. lets test that the application is restarting upon changes implemented into src folder. E.g. go to the src/user/user.controller.ts and replace "@HttpCode(204)" on a line 53 (just above the remove function) with the following: "@HttpCode(203)". Save the file (ctrl+s or cmd+s). In the terminal 1 notice that the app has restarted. Go to the terminal 2 and run: "npm run test". Now there are some failed test - this is a prove that the app in container is changing and reloading according to the changes implemented in the local src folder. Undo the changes in the file (+20 application is restarting upon changes implemented into src folder).

11. open docker-compose.yml file. Notice the "restart: always" option, which is auto restarting the container after crash (+30 container auto restart after crash).
    Behold that the postgres container is configured as dependency for application container (depends_on: - postgres)
    and that there are no hardcoded variables in the iml file - they are all taken from the .env file and are assigned in the “environment”;

12. Open both docker files and see that required images are used: postgres and node;

13. in terminal 2 run "docker network ls" - in the list you should see the user-defined bridge network called "custom-network". This network is created via docker-compose.yml file, where it is configured as network for both "postgres" and "node" services (+30 user-defined bridge is created and configured).

14. In terminal 2 run “docker volume ls” - in the list you should see the volume called nodejs2024q1-service_postgres, which is created via docker-compose.yml file (+30 database files and logs to be stored in volumes instead of container);

15. In terminal 2 run “docker image ls” - see the two images nodejs2024q1-service-node and nodejs2024q1-service-postgres. Notice that each of them is less than 500MB (+20 Final size of the Docker image with application is less than 500 MB);

16. Go to the prisma/schema.prisma folder - notice the relations used - each @relation (+10 typeorm decorators or prisma relations create relations between entities).
    Also notice the following: datasource db {provider = "postgresql" url = env(“DATABASE_URL”)} (prisma saves data to postresql database);
    For each module check the .service files and see that they all use prisma:
    (+20 Users data is stored in PostgreSQL database and typeorm / prisma interacts with the database to manipulate data.+20 Artists data is stored in PostgreSQL database and typeorm / prisma interacts with the database to manipulate data.+20 Albums data is stored in PostgreSQL database and typeorm / prisma interacts with the database to manipulate data.+20 Tracks data is stored in PostgreSQL database and typeorm / prisma interacts with the database to manipulate data.+20 Favorites data is stored in PostgreSQL database and typeorm / prisma interacts with the database to manipulate data).

17. Go to the package.json and in “scripts” find the following command which is used to run the app in the docker: “start:migrate:prod”. See that migrations are used here “npx prisma migrate deploy” (+30 Migrations are used to create database entities);

18. Visit https://hub.docker.com/repository/docker/sirsenya/nodejs2024q1-service-node/tags?page=1&ordering=last_updated to see that images were pushed to the docker hub (+20 Your built image is pushed to DockerHub);

19. Don’t forget to close the app, stop containers and delete images from your machine for memory saving. Thanks for you attention and have a nice day!
