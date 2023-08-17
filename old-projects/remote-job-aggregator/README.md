<div align="center">
<h1>Remo: Full Stack React and Django Application</h1>
</div>

<div align="center">
<img src='./Remo-logo.jpeg' alt="logo" />
</div>
<h4 align="center">
<em>Remo is a remote jobs site connecting employees and business owners worldwide.</em>
</h4>

<br>

# To run the application:

Start the backend server first, then run `npm start` after meeting the requirements mentioned below.

#### Backend Requirements:

Install the required packages provided in `requirements.txt` file.

#### Frontend Requirements:

- Use `npm install` to install the required packages.

- Internet connection to avoid the error below.

```
Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
 - options.allowedHosts[0] should be a non-empty string.
```

<strong>Note: Both the main and backend folders contain the requirements.txt file.</strong>

<br>

# Backend Distinctiveness and Complexity

## Automated Database Updates

The `Remotive` database is populated every six hours using Remotive's API. These requests check for duplicates and publication dates and remove existing posts that have expired (i.e., one month has passed since publication).

## Google Login

- Users can log in to the website using their google accounts. Once the user logs in, the backend server adds a `refresh token` to the database and the user's browser. The `refresh token` allows users to stay logged in on future visits.

- On logout, the backend server removes the `refresh token` from the database and the user's browser.

## Image upload

- Users can upload images stored relative to their registered profiles and retrieve them upon request.

- Users can choose to delete their images, removing both the stored image and its reference from the database.

## Data Manipulation

The backend server can parse incoming JSON data, save it to the database and send back appropriate responses on demand.

<br>

# Frontend Distinctiveness and Complexity

## CSS

- The website gets its styling without the use of external libraries.

- Animated navigation bar.

- Fully responsive design for bigger screens.

- Animated web pages and calculated page dimensions for bigger screens.

- Media queries for smaller screens with an alternative website design.

## Job Board

- Search logic with multiple parameters without the use of an external library.

- A reusable component using props for displaying job listings.

- Pagination with array manipulation, using `state` and `ref`.

- Conditionally enabled/disabled pagination buttons using props.

- Conditional page rendering using app-wide context.

## Job Listings && Job Applicants

Parse the incoming image data and user information and display them on the frontend.

## Login Page

Communicates with Google's sign-in API and sends the relevant information to the backend for authentication.

## Navbar

- Conditionally renders CSS styles on URL change.

- Conditionally renders tabs on user authentication.

## Profile Page

- Instant markdown rendering.

- Edit and save in place using react hooks and javascript.

- Conditional view rendering (edit view and main view).

- Creates a FormData object that provides the required data structure for image upload to the backend.

- Conditional profile edit and upload access depending on the visiting user.

## View job

Conditionally sets the user's ability to apply depending on the user's login status, application status, and post ownership.

<br>

# Frontend Structure

<strong><u>The list sorting is in tandem with the original project structure.</u></strong>

## Buttons Folder

The folder contains page navigation buttons used in both Job Boards (Remo and Remotive).

## JobBoard Folder

The folder contains a reusable job listing component with search capabilities and pagination.

## JobListingPage Folder

<strong>JobListingPage.js:</strong> fetches the user's job posts and displays them to the frontend.

<strong>JobApplicantsList Folder:</strong> fetches applicants' information and images and provides a link to the applicants' profile page.

## Login Folder

Communicates with Google's sign-in API and sends user credentials to the backend for verification.

## NavBar Folder

Checks for login status and URL pathname and renders the navigation tabs accordingly.

## Profile Folder

<strong>Profile.js:</strong> fetches and renders user images, offers the user image upload capabilities, and checks for the visiting user's authentication status.

<strong>ProfileMarkDown Folder:</strong> fetches and renders profile markdown, allows users to edit their profile in place, and saves their modifications to the backend.

## Remo Folder

<strong>PostJob Folder:</strong> renders a form for a new job post, adds a unique key to each entry using `uuid`, and sends them to the backend. Job descriptions can be written in markdown and rendered as such.

<strong>RemoJobBoard Folder:</strong> fetches local job listings saved to the database and passes them as props to the JobBoard component.

<strong>ViewJob Folder:</strong> fetches and displays the requested job post information (allows users to view the job description in markdown.)

## RemotiveJobs Folder

Fetches `Remotive` jobs from the backend and passes them as props to the JobBoard component.

## UserContext

The folder contains the `userContext`, which initializes app-wide context with a null value.

## App.js

Renders app components, uses `react-router-dom` for rendering the requested content, and sends authentication requests to the backend using `useEffect`.
