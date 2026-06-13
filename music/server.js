import app from "./src/app.js";
import connectToDB from "./src/db/db.js";



connectToDB()
app.listen(3002,()=>{
    console.log('Music server is running on port : 3002');
    
})