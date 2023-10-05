# TinyApp Project 💻

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Description

Users can create accounts to create/delete/edit shortened URL links.  Do note, there isn't a DB in the backend.  That portion is mocked in the server (all data is lost in a shutdown/restart).

## Branches

* Main - demo ready

* feature/cookies - allows setting and getting public (unsecured cookies).  Main version uses secured sessions.

* feature/user-registration - creation of new users and storage inside mock DB.

## Final Product

* The Url Page:
!["URL Page"](https://github.com/robertshum/tinyapp/blob/main/docs/url-page.png)

* Registering New Users:
!["Register New User Page"](https://github.com/robertshum/tinyapp/blob/main/docs/register-page.png)

* Edit Link page for JUMBOSIZEDMOTORBOATPINATAS.com:
!["Edit URL Page"](https://github.com/robertshum/tinyapp/blob/main/docs/edit-url.png)

## Dependencies

- Node.js v12.22.12
- NPM 6.14.16
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` or `node .`command.