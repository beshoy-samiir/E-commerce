const app = require("./app/app.js")
const port = process.env.port||3000;
app.listen(port,()=> console.log(`we are on http://localhost/${port} `))