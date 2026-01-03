// Vercel serverless function handler
// Use require to load the compiled handler from dist folder
// This works better in serverless environments than ES6 imports
const handler = require('../dist/main').default;

export default handler;

