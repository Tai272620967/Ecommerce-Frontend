export const AUTH_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD:
    "The email address or password you entered is incorrect. Please try again.",
  LOGIN_FAILED: "Login failed. Please try again.",
  ACCOUNT_LOCKED:
    "Your account has been locked. Please try again after 30 minutes.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTER_SUCCESS: "New member registration completed successfully.",
  PASSWORD_RESET_SUCCESS: "Password reset successful.",
  EMAIL_SENT: "Verification email has been sent.",
};

export const ERROR_MESSAGES = {
  SERVER_ERROR: "A server error occurred. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "There is an error in the input information. Please check.",
  REGISTER_ERROR: "New member registration failed.",
};

export const VALIDATE_MESSAGES = {
  VALID_EMAIL: "Please enter a valid email address.",
  EMAIL_REQUIRED: "Please enter your email address.",
  PASSWORD_REQUIRED: "Please enter your password.",
  FIELD_REQUIRED: "This field is required.",
  POSTAL_CODE_REQUIRED: "Please enter your postal code",
  CONFIRM_PASSWORD_IS_NOT_MATCHED: "Passwords do not match",
}

export const COOKIE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  NETWORK_Error: 'networkError',
  IS_LOGGED_IN: 'isLoggedIn',
};
