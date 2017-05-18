# web-shop-final
To run the solution locally, create config-secret.js in root of the project with following content:

module.exports = {
	'database': '<DATABASE_CONNECTION_STRING>',
	'secret': '<APP_SECRET>'
};

If this file is not found, app will try to load database connection string and app secret from environment vars. This is used in production environment in heroku.
