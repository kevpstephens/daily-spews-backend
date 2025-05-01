# Northcoders News API <br> [![Hosted on Render](https://img.shields.io/badge/Hosted-Render-purple)](https://nc-news-api-gtk7.onrender.com/api) [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)  [![Node.js](https://img.shields.io/badge/Runtime-Node.js-green)](https://nodejs.org/) ![Jest](https://img.shields.io/badge/Tested_with-Jest-%23C21325?logo=jest&logoColor=white)

<p align="center">
  <img src="https://www.manchesterdigital.com/storage/6766/Northcoders-Primary-Logo---Red.png" alt="Northcoders Logo" width="125" height=auto/>
</p>

<!-- [![version](https://img.shields.io/npm/v/express)](https://nodejs.org/) -->
<!-- ![Express](https://img.shields.io/badge/Express.js-404D59?logo=express) -->

A RESTful API that provides the backend for a Reddit-style news app. <br>
- Built with a stack that includes **Node.js**, **Express**, and **PostgreSQL**.
- This API permits access to articles, comments, topics, and users. <br> 
- Features include the ability to retrieve data, sort, filter, add/remove votes, post and delete comments. <br> 
- Thoroughly tested using **Jest** and **Supertest**. <br> 
- Deployed online via **Render** with a hosted **Supabase** **PostgreSQL** database. 
<br> 
<br> 


🔗 **Live API, hosted on Render** - [https://nc-news-api-gtk7.onrender.com/api](https://nc-news-api-gtk7.onrender.com/api) 

<br><br>

# Requirements: 

To run this project locally or in production, ensure you have the following installed:
- [**Node.js**](http://nodejs.org): v18.x or higher  

- [**PostgreSQL**](https://www.postgresql.org): v15 or higher  

<br>

Full **tech stack** listed [below](#Tech-Stack).


<br><br>

# Installation & Local Setup:
### 1️⃣ - Clone the repo:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/northcoders-news-BE.git 
```
<br>

### 2️⃣ - Install dependencies:
```bash
npm install
``` 
<br>

### 3️⃣ - Setup environmental dependencies:
- Create **two** .env files in your projects root directory:
<br>

```shell
# .env.development

PGDATABASE=nc_news
```
<br>

```shell
# .env.test
PGDATABASE=nc_news_test
```
<br>

### 4️⃣ - Setup local databases:
- First, ensure that **Postgres** is running locally 
- Then, create your **two** databases
```shell
npm run setup-dbs
```
<br>

### 5️⃣ - Seed databses:


```shell
npm run seed-dev
```
```shell
npm run test-seed
```
<br>

### 6️⃣ - Run tests:
```shell
npm test
```

<br><br>

# Tech Stack:
<br>

| Technology   | Purpose                                | Required to Run Locally? |
|--------------|----------------------------------------|---------------------------|
| Node.js      | JavaScript runtime environment         | ✅ Yes                    |
| Express.js   | Web framework for Node.js              | ✅ Yes                    |
| PostgreSQL   | Relational database system             | ✅ Yes                    |
| Jest         | Testing framework                      | 🔶 Only for testing       |
| Supertest    | HTTP assertions for testing API        | 🔶 Only for testing       |
| Supabase     | Hosting platform for PostgreSQL DB     | ❌ Only for deployment    |
| Render       | Hosting platform for Node API          | ❌ Only for deployment    |


<br>

<!-- 2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣ -->