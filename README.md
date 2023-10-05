# TinyApp Project 💻

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Description

Users can create accounts to create/delete/edit shortened URL links.  Do note, there isn't a DB in the backend.  That portion is mocked in the server (all data is lost in a shutdown/restart).

Finished Stretch Goals:

* Used method override so express can intercept PUT and DELETE endpoints from form POST.
```js
app.delete(...)
app.put(...)
```
* Analytics that track the # of times a link has been redirected, as well as a record of the timestamps.

Unfinished Stretch Goals:

* Keep track of how many UNIQUE visitors visit each url (using cookie sessions).

## Branches

* Main - demo ready.

* feature/cookies - allows setting and getting public (unsecured cookies).  Main version uses secured sessions.

* feature/user-registration - creation of new users and storage inside mock DB.

* feature/analytics - allows links to show how many times it has been redirected, and timestamp records of each redirect.

## Final Product

* The Url Page:
!["URL Page"](https://github.com/robertshum/tinyapp/blob/main/docs/url-page.png)

* Registering New Users:
!["Register New User Page"](https://github.com/robertshum/tinyapp/blob/main/docs/register-page.png)

* Edit Link page for JUMBOSIZEDMOTORBOATPINATAS.com:
!["Edit URL Page"](https://github.com/robertshum/tinyapp/blob/main/docs/edit-url-page.png)

## Dependencies

- Node.js v12.22.12
- NPM 6.14.16
- Express
- EJS
- bcryptjs
- cookie-session
- method-override

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` or `node .`command.