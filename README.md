# Home Library Service

To run and test the program you might consider doing the following:

1. git checkout development;
2. npm i;
3. rename .env.example file to .env, for the port variable is there;
4. npm start;
5. in a separate terminal window: "npm run test"; should be the following result: Test Suites: 5 failed, 5 passed, 10 total Tests: 27 failed, 67 passed, 94 total. Only 67 tests are passed for the following task; I suppose other tests
   are going to be resolved in the future assignments.
6. npm run lint - make sure there are no errors;
7. open the source folder and behold the separation of modules in accordance with nest customs;
8. go to the doc/api.yaml - it is generated by nest thus corresponds with the assignment. You can check it manually by launching it in an api manager (f.e. postman), or by opening http://localhost:4000/api/ in your browser while the server is running. Remark: in favs in field "entity" you shall type "user"/"track"/"album"/"artist"
   Thanks for your attention!

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
