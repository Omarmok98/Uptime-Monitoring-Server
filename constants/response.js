const RESPONSE_MESSAGES = {
  VALIDATION_FAILURE: "Validation failed",
  USER_CREATION_ERROR: "User could not be created. please try again",
  USER_SIGNUP: "User created succesfuly, Verification code is sent",
  DUPLICATE_USER: "Email already exists",
  UNVERIFIED_USER: "Pending Account. Please Verify Your Email",
  VERIFIED_USER: "User already verified",
  UNAUTHENTICATED_USER: "User authentication failed",
  AUTHENTICATED_USER: "User authentication successful",
  WRONG_CODE: "Verification code do not match",
  VERIFICATION_SUCCESS: "Email verified",
  VERIFICATION_FAIL: "Could not verify email",
  URL_CREATED: "Url created successfuly",
  URL_CREATION_ERROR: "Url could not be created. please try again",
  URL_DELETED: "Url deleted successfuly",
  URL_DELETION_ERROR: "Url could not be deleted. please try again",
  URL_UPDATED: "Url updated successfuly",
  URL_UPDATION_ERROR: "Url could not be updated. please try again",
  UNAUTHORIZED: "User is not authorized to take this action",
  DUPLICATE_URL: "Url name already exists",
  URL_NOT_EXIST: "Url does not exist",
};

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
};
module.exports = {
  RESPONSE_MESSAGES,
  HTTP_STATUS,
};
