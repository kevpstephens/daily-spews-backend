# Northcoders News API <br> [![Hosted on Render](https://img.shields.io/badge/Hosted-Render-purple)](https://nc-news-api-gtk7.onrender.com/api) <space> [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-blue)](https://www.postgresql.org/) <space> [![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/) <space> ![Jest](https://img.shields.io/badge/Tested_with-Jest-%23C21325?logo=jest&logoColor=white) <space> [![CI & CD](https://github.com/kevpstephens/NC-news/actions/workflows/ci-cd.yml/badge.svg?cacheBust=1)](https://github.com/kevpstephens/NC-news/actions/workflows/ci-cd.yml) <space> [![Last Commit](https://img.shields.io/github/last-commit/kevpstephens/NC-news)](https://github.com/kevpstephens/NC-news/commits/main)

<!-- [![version](https://img.shields.io/npm/v/express)](https://nodejs.org/) -->
<!-- ![Express](https://img.shields.io/badge/Express.js-404D59?logo=express) -->

<br>
<p align="center">
  <img src="https://www.manchesterdigital.com/storage/6766/Northcoders-Primary-Logo---Red.png" alt="Northcoders Logo" width="150" height=auto/>
</p>
<br>

A RESTful API that provides the backend for a Reddit-style news app. <br>

- Built with a stack that includes **Node.js**, **Express**, and **PostgreSQL**.
- This API permits access to articles, comments, topics, and users.
- Features include the ability to retrieve data, sort, filter, add/remove votes, post and delete comments.
- Thoroughly tested using **Jest** and **Supertest**.
- Deployed online via **Render** with a hosted **Supabase** **PostgreSQL** database.

<br>

🔗 **Live API, hosted on Render** - [https://nc-news-api-gtk7.onrender.com/api](https://nc-news-api-gtk7.onrender.com/api) <br>

## <br><br>

# Index:

- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)

## <br><br>

# Requirements:

To run this project locally or in production, ensure you have the following installed:

- [**Node.js**](http://nodejs.org): v18.x or higher

- [**PostgreSQL**](https://www.postgresql.org): v15 or higher

<br>

> 💡 **Note:** Full **tech stack** listed <u>[below](#tech-stack)</u>.

## <br><br>

# Installation & Setup:

### 1️⃣ - Clone the repo:

> - Clone the repo down to your local machine using Git

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/northcoders-news-BE.git
```

<br>

### 2️⃣ - Install dependencies:

> - Install all project dependencies listed in the package.json

```bash
npm install
```

<br>

### 3️⃣ - Setup environmental dependencies:

> - Create **two** .env files in your projects root directory:

```shell
# .env.development

PGDATABASE=nc_news
```

> <br>

```shell
# .env.test

PGDATABASE=nc_news_test
```

<br>

### 4️⃣ - Setup local databases:

> - First, ensure that **Postgres** is running locally
> - Then, create your **two** databases

```shell
npm run setup-dbs
```

<br>

### 5️⃣ - Seed databases:

> - Seed development database

```shell
npm run seed-dev
```

> - Seed test database

```shell
npm run test-seed
```

<br>

### 6️⃣ - Run tests:

> - Run all tests using Jest to verify functionality

```shell
npm test
```

## <br><br>

# Tech Stack:

<br>

| 🛠️ Tech Used   | 🔍 Purpose                         | 🧑🏻‍💻 Required Locally?   |
| -------------- | ---------------------------------- | ---------------------- |
| **Node.js**    | JavaScript runtime environment     | ✅ Yes                 |
| **Express.js** | Web framework for Node.js          | ✅ Yes                 |
| **PostgreSQL** | Relational database system         | ✅ Yes                 |
| **Jest**       | Testing framework                  | 🔶 Only for testing    |
| **Supertest**  | HTTP assertions for testing API    | 🔶 Only for testing    |
| **Supabase**   | Hosting platform for PostgreSQL DB | ❌ Only for deployment |
| **Render**     | Hosting platform for Node API      | ❌ Only for deployment |

<br>

<br>

<!-- 2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣ -->
