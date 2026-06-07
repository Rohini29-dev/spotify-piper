import app from "./src/app.js";
import { connect } from "./src/broker/broker.js";
import connectToDB from "./src/db/db.js";


connectToDB()
connect();
app.listen(3000,()=>{
    console.log("Auth server is running on port 3000");
    
})