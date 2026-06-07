import app from "./src/app.js";
import { connect } from "./src/broker/broker.js";
import startListener from "./src/broker/listener.js";


connect().then(startListener)



app.listen(3001, () => {
    console.log(" Notification Server is running on port 3001");
})