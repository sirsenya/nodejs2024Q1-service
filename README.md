To run and test the program you might consider doing the following:

1. install and run docker on your computer;

2. in a terminal (terminal 1) run: "git checkout dev_task3";

3. in terminal run: "npm i";

4. rename .env.example file to .env;

5. make sure that you have no other docker containers/images nor servers running, especially on ports 4000 and 5432;

6. in terminal run: "docker-compose up --build". It might take a while, but eventually you shall see greenish logs - the app has started;

7. in separate terminal window (terminal 2) run: "npm run lint"; Should be no detected errors;

8. Go to src/custom-logger/logs folder. See that it is empty.

9. in terminal 2 run: "npm run test:auth"; All tests should be passed; Mind the logs that you see: they are custom;

10. in terminal 2 run: "npm run test:refreh"; All test should be passed; Mind the logs that you see: they are custom;

11. Go to src/custom-logger/logs folder. Behold that logs are saved to the files with implemented rotation and separated to errors and logs. Max file size is 1000 and is stored in the .env file. Logs have multiple (three) levels: log, error, verbose. Log level is stored in the .env and is 2 (max: logs, error and verbose are logged); You can choose your log level: 0 - only errors are logged, 1 - erros and logs are logged, 2 - errors, logs and verbose are logged. After changing any env variable you have to rerun the docker (1. ctrl/cmd + c 2. docker compose down 3. docker compose up --build) for the changes to be applied.

12. In order for you to comfortabelly check listening to unchaughtException and unhandledRejection events I made a simulator for these errors: while the app is running go to the http://localhost:4000/ in your browser (will result in ERROR: Caught unhandledRejection event) in the logs and go to http://localhost:4000/doc (ERROR: Caught uncaughtException event - in the logs); Both listeners are located in main.ts. Notice that both paths do not require authorization.

13. Don’t forget to close the app, stop containers and delete images from your machine for memory saving. Thanks for you attention and have a nice day!
