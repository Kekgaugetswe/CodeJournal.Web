# Requirements Document

## Introduction

This feature adds a self-service user registration flow to the CodeJournal Angular application. A new `RegisterComponent` and supporting service method will allow visitors to create an account by submitting a username, email, and password. On success the user is redirected to the login page. The feature mirrors the existing login flow in structure and integrates with the backend `/api/auth/register` endpoint.

## Glossary

- **Register_Component**: The Angular standalone component that renders the registration form and handles submission.
- **Auth_Service**: The existing `AuthService` in `src/app/features/auth/services/auth.service.ts` that communicates with the backend auth API.
- **Register_Request**: The data model carrying `userName`, `email`, and `password` sent to the backend.
- **Register_Endpoint**: The backend HTTP POST endpoint at `/api/auth/register`.
- **Router**: The Angular `Router` service used for client-side navigation.
- **Validator**: Angular's built-in reactive/template-driven form validation.

---

## Requirements

### Requirement 1: Registration Form

**User Story:** As a visitor, I want to fill in a registration form with my username, email, and password, so that I can create a new account.

#### Acceptance Criteria

1. THE Register_Component SHALL render a form containing a username field, an email field, a password field, and a confirm-password field.
2. WHEN the registration form is displayed, THE Register_Component SHALL set focus to the username field.
3. THE Validator SHALL require the username field to be non-empty before the form can be submitted.
4. THE Validator SHALL require the email field to contain a valid email address format before the form can be submitted.
5. THE Validator SHALL require the password field to contain at least 6 characters before the form can be submitted.
6. THE Validator SHALL require the confirm-password field value to match the password field value before the form can be submitted.
7. WHILE a form field contains a validation error and the user has interacted with that field, THE Register_Component SHALL display a descriptive inline error message adjacent to that field.

---

### Requirement 2: Registration Submission

**User Story:** As a visitor, I want to submit the registration form, so that my account is created on the server.

#### Acceptance Criteria

1. WHEN the user submits a valid registration form, THE Auth_Service SHALL send an HTTP POST request to the Register_Endpoint with the `userName`, `email`, and `password` values.
2. WHILE a registration request is in flight, THE Register_Component SHALL disable the submit button to prevent duplicate submissions.
3. WHEN the Register_Endpoint returns a success response, THE Router SHALL navigate the user to the `/login` route.

---

### Requirement 3: Registration Error Handling

**User Story:** As a visitor, I want to see a clear error message when registration fails, so that I know what went wrong and can correct it.

#### Acceptance Criteria

1. IF the Register_Endpoint returns an error response, THEN THE Register_Component SHALL display a user-readable error message on the form.
2. IF the Register_Endpoint returns an error response, THEN THE Register_Component SHALL re-enable the submit button so the user can retry.
3. IF the Register_Endpoint returns a 400 status indicating the email is already in use, THEN THE Register_Component SHALL display the message "An account with this email already exists."
4. IF a network error occurs during submission, THEN THE Register_Component SHALL display the message "Unable to connect. Please try again later."

---

### Requirement 4: Navigation to Registration

**User Story:** As a visitor, I want to reach the registration page from the login page, so that I can easily find where to sign up.

#### Acceptance Criteria

1. THE Login_Component SHALL render a link that navigates to the `/register` route.
2. THE Router SHALL resolve the `/register` path to the Register_Component without requiring authentication.

---

### Requirement 5: Post-Registration Redirect

**User Story:** As a newly registered user, I want to be redirected to the login page after successful registration, so that I can immediately sign in with my new credentials.

#### Acceptance Criteria

1. WHEN registration succeeds, THE Router SHALL navigate to `/login`.
2. WHEN the user arrives at `/login` after registration, THE Login_Component SHALL display a success notification informing the user that their account was created and they can now log in.
