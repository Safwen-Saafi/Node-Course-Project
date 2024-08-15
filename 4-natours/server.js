const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');
// console.log(process.env); Logs all of the env variables running in the process
// console.log(app.get('env')); //The output should be development
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}...`);
});

//npm i nodemon --global => to install it globally on pc
//Param middleware is a special middleware that runs only on specific params
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

// Environment variables in Node.js are variables that are stored outside of your code and can be used to store configuration data
// such as database connection strings, API keys, or other sensitive information. They allow you to configure different aspects of your application
// depending on the environment (e.g., development, production) without changing the actual code.

// Why Use Environment Variables?
// Security: Sensitive information like API keys and database passwords should not be hardcoded in your application. Instead, they can be stored in environment variables.
// Flexibility: Environment variables allow you to configure your application differently based on where it is running (e.g., development, testing, production).
// Portability: You can easily move your application between environments without needing to modify the source code, simply by changing the environment variables
