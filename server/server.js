const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDb = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const cookieparser=require("cookie-parser")
const bodyParser = require('body-parser');
const { sendMail } =require("./controller/userController")
const reset= require("./controller/resetpassController"); 

const app = express()
dotenv.config();
app.use(express.json());
app.use(cookieparser());
app.use(bodyParser.json());
app.use(cors());
connectDb();

app.use("/api", userRoutes)

app.get("/", (req, res) => {
    res.send("backend is running")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    console.log(`Listening on http://localhost:${PORT}`);
})
