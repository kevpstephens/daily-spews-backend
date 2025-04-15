# NC News Seeding

# Intro:

A backend project providing data for a news-based website

# Instructions:

Before start, make sure to install npm by running:

- `npm install`

\
**<u>Step 1</u>**: Run the setup script

- `npm run setup-dbs`

\
**<u>Step 2</u>**: Set up environment variables
\
Create two .env files in your database and store in project root directory:

\
 1.) .env.test

    PGDATABASE=nc_news_test

\
 2.) .env.development

    PGDATABASE=nc_news

\
**<u>Step 3</u>**: Verify your setup.
\
Run the following scripts

1.) `npm run test-seed`

2.) `npm run seed-dev`
