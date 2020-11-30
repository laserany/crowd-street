# crowd-street-frontend

## Part1: CI/Github Actions
Github Actions was used as the CI tool. There are 2 branches, one for frontend-test and one for frontend-prod. The github action jobs details can be found 
inside .github/workflows/frontend.yml file.

2 jobs run sequentially. The first job runs our maven tests and the second job pushes my changes automatically to frontend-prod branch 
(if tests succeeds otherwise I receive an email for test failures). Therefor please pull from frontend-prod branch to run the final code.

## Part2: Requirments to run the project locally
1. You need Node 14 (earlier versions would probably work too as long as your version can support react hooks and redux toolkit)
2. You can use npm start to run the application.

## Part3: Overview of the project
* The project uses React(front end framework) and Redux (for application state management).
* The project consists of 2 main components. One for the investment form request(landing page + form) and one for the investment form response(modal that displays response based on the request form submitted).
* investment form request component consists of a background image, a form with multiple fields such as investment amount, investment type etc. that are validated using formik and yup schema. When the form is submitted by clicking on the Apply now button, a call is made to a fake backend (used mock-fetch library for this).
* The response generated from the backend is one out of three. Either bad request response in case of very large investment amount, or qualified or disqualified based on the investment amount, total networth, yearly income and the credit score. 
* After the response is sent back, redux states (qualified, badRequest) get updated accordingly and (show) state gets set to true that would allow the 2nd component to appear (which is represented by a modal).
* The investment form response component (which is a modal) will response accordingly based on the redux states updated by the request(qualified, badRequest).
* In case the applicant was qualified, a response will be in a shape of a another form (used formik + yup as well) that has 3 fields (username, password and confirm password) that are validated accordingly as well. Once the form is submitted successfully, a success message will be displayed.
* To not allow applicants to modify their applications, once users close out of the modal, they will be redirected to another page(www.crowdstreet.com) and all the application states will be initialized as well.
* More details about the project are provided within the project comments.
