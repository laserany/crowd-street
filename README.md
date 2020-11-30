# crowd-street-backend

## Part1: CI/Github Actions
Github Actions was used as the CI tool. There are 2 branches, one for backend-test and one for backend-prod. The github action jobs details can be found 
inside .github/workflows/backend.yml file.

2 jobs run sequentially. The first job runs our maven tests and the second job pushes my changes automatically to backend-prod branch 
(if tests succeeds otherwise I receive an email for test failures). Therefor please pull from backend-prod branch to run the final code.

## Part2: Requirments to run the project locally
1. You need Java 15 (If you don't have it, easy solution is to dockerize it. Example on how to do this is here https://www.baeldung.com/dockerizing-spring-boot-application)
2. one VM option must be passed which is 
-Djasypt.encryptor.password=${password}.
The password will be provided securely over email.
3. preview features have to be enabled by your IDE or by appending --enable-preview to the command line/terminal.
4. In order to run the project using command line, run mvn package command on the root to generate the jar file then run `java -jar --enable-preview -Djasypt.encryptor.password=${password} backend-0.0.1-SNAPSHOT.jar`.

## Part3: Overview of the project
* The project uses Spring Boot, AWS Lambda (as 3rd service) and H2 as our in-memory database and storing sessions. 
* Requests are sent first to the post method /request then that request get sent to the 3rd service (AWS lambda) for processing. The AWS keys are encrypted 
using Jasypt library. An IAM Role was created in AWS that is only authorized to invoke the lambda function created in AWS.
* In real life, the AWS lambda will process the request and send the response back to the callback URL however our application is not hosted so the function is not doing anything
but instead we are calling the callback URL within the same server and provides a unique ID using UUID.
* The POST method /callback/{id} receives the request and stores the new status in the session then returns status 204 (NO CONTENT).
* The PUT method /callback/{id} is used to update the status and provide details to that status. A check was implemented to make sure that the status is
provided correctly and that the status with the ID we provided already exists otherwise sending a different response.
* Finally we have our GET method /status/{id} which is used to retrieve the the status with all its details from the in-memory database as it was stored in the session tables.
This is ofcourse just for demo purposes. Ideally a real database should be used to persist the data. Also Caching is really recommended for get Requests to avoid calling the DB
each time for better performance.
* More details about the project are provided within the project comments.
