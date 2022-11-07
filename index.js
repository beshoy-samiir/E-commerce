const app = require("./app/app")
const port = process.env.port||3000;
app.listen(port,()=> console.log(`we are on http://localhost/${port} `))