
const generateRandomString = function() {

  let results = '';

  //do this 6 times
  const count = 6;
  let char = '';
  for (let i = 0; i < count; i++) {
    if (Math.random() <= 0.5) {
      //pick a range from 97-122, randomly (a-z)
      const alphaNum = 97 + Math.random() * (122 - 97 + 1);

      //convert that to a character. String.fromCharCode()
      char = String.fromCharCode(alphaNum);
      results += char;
      continue;
    }

    //else, >= 0.5
    //pick a range from 65-90, randomly (a-z)
    const alphaNum = 65 + Math.random() * (90 - 65 + 1);

    //convert that to a character. String.fromCharCode()
    char = String.fromCharCode(alphaNum);
    results += char;
  }

  return results;
};

const getUserLoggedIn = function(req) {

  if (req.session && req.session.userId) {
    return req.session.userId;
  }

  return undefined;
};

const findUserByEmail = function(users, email) {

  //return null if email is empty
  if (typeof email === "string" && email.length === 0) {
    //empty
    return undefined;
  }
  //iterate over users
  //get the email of the object
  //if it matches return user object NOT users.
  for (const userKey in users) {
    const userParam = users[userKey];
    if (userParam.email === email) {
      return userParam;
    }
  }
  //if it gets to here, return undefined
  return undefined;
};

const urlsForUser = function(urlDatabase, userId) {
  const result = {};

  for (const urlKey in urlDatabase) {
    const urlObject = urlDatabase[urlKey];
    if (urlObject.userId === userId) {
      //add it to the result
      result[urlKey] = urlObject;
    }
  }

  return result;
};

const getPrettyCurrentDate = function() {

  // Get the current date and time
  const now = new Date();

  // Format the date and time nicely
  const formattedDate = now.toLocaleDateString(); // Format as "MM/DD/YYYY" or "DD/MM/YYYY" depending on locale
  const formattedTime = now.toLocaleTimeString(); // Format as "HH:MM:SS AM/PM" depending on locale

  // Combine date and time for a full timestamp
  return `${formattedDate} ${formattedTime}`;
};

module.exports = {
  urlsForUser,
  findUserByEmail,
  getUserLoggedIn,
  generateRandomString,
  getPrettyCurrentDate
};