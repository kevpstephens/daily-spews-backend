# NC News Seeding

# Intro:

A backend project providing data for a news-based website
<br>
<br>

# Instructions:

### <u>Step 1</u>:

Before you start, make sure to install npm by running:

- `npm install`

<br>

### <u>Step 2</u>:

<!-- **<u>Step 1</u>**: Run the setup script -->

Run the setup script:

- `npm run setup-dbs`

<br>

### <u>Step 3</u>:

<!-- **<u>Step 2</u>**: Set up environment variables -->

Create two .env files in your database and store in project root directory:

1.) .env.test

    PGDATABASE=nc_news_test

2.) .env.development

    PGDATABASE=nc_news

<br>

### <u>Step 4</u>:

<!-- **<u>Step 3</u>**: Verify your setup. -->

Run the following scripts:

1.) `npm run test-seed`

2.) `npm run seed-dev`
