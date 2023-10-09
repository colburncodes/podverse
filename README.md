# Podverse

Creating a server for the mobile application of Podverse.


## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)



## Features

- User Registration
- User Login
- Authorization with middleware
- Authentication with JSON web tokens.
- Email Integration using [Mail Trap](https://mailtrap.io/) and [Beefree](https://beefree.io/)


## Tech Stack

**Server:** Node, Express, Mongoose, NodeMailer

## Podverse API Explorer

| Endpoint | Methods | Description |
| -------- | ------- | ----------- |
| `auth/create` | `POST` |   Create a new user|
| `auth/verify-email` | `POST` |   Verify user's email|
| `auth/send-verify-email` | `POST` |   Verification token to validate user|

## Run Locally

Clone the project

```bash
  git clone https://github.com/colburncodes/podverse
```

Go to the project directory

```bash
  cd podverse
```

Install dependencies

```bash
  npm install
```

Create a `.env` file in root directory

```
MONGODB_URI="mongodb://localhost:27017/<db-name>"
MAILTRAP_USER=<usertoken>
MAILTRAP_PASS=<password>
```

Start the server

```bash
  npm run start to launch the server
```

```bash
  npm run dev to launch the server with the hot reload feature
```
