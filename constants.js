
//pre defined variables
const MSG_LOGIN_TO_VIEW_LIST_URLS = "<html><body>Please login or create an account to view and create URLs.</body></html>\n";

const MSG_LOGIN_TO_VIEW_URL = "<html><body>You cannot view a URL unless you are logged in.</body></html>\n";

const MSG_AUTHOR_VIEW_ONLY = "<html><body>You cannot view the URL unless you were the author.</body></html>\n";

const MSG_URL_KEY_INVALID = "<html><body>The URL key does not exist.</body></html>\n";

const MSG_CANNOT_FIND_USER_CRED = "cannot find user with this email and password";

const MSG_EMPTY_EMAIL_PW = "Your password or email is empty.";

const MSG_EMAIL_TAKEN = "This email is taken, buckaroo.";

const MSG_CANNOT_SHORT_URL_WITHOUT_ACCT = "<html><body>You cannot shorten URLs unless you have an account.</body></html>\n";

const MSG_MISSING_HTTP = "<html><body>Please attach http:// or https://</body></html>\n";

const MSG_LOGIN_TO_EDIT_URL = "<html><body>You cannot edit links unless you are logged in.</body></html>\n";

const MSG_AUTHOR_TO_EDIT_URL = "<html><body>You cannot edit the URL unless you were the author.</body></html>\n";

const MSG_LOGIN_TO_DELETE_URL = "<html><body>You cannot delete links unless you are logged in.</body></html>\n";

const MSG_AUTHOR_TO_DELETE_URL = "<html><body>You cannot delete the URL unless you were the author.</body></html>\n";

const PORT = 8080;

module.exports = {
  MSG_LOGIN_TO_VIEW_LIST_URLS,
  MSG_LOGIN_TO_VIEW_URL,
  MSG_AUTHOR_VIEW_ONLY,
  MSG_URL_KEY_INVALID,
  MSG_CANNOT_FIND_USER_CRED,
  MSG_EMPTY_EMAIL_PW,
  MSG_EMAIL_TAKEN,
  MSG_CANNOT_SHORT_URL_WITHOUT_ACCT,
  MSG_MISSING_HTTP,
  MSG_LOGIN_TO_EDIT_URL,
  MSG_AUTHOR_TO_EDIT_URL,
  MSG_LOGIN_TO_DELETE_URL,
  MSG_AUTHOR_TO_DELETE_URL,
  PORT
};