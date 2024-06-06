const express = require("express"); //module that has express
const connectDB = require("./connect");//module that connects to mongoDB

const port = 8080;
const appName = "Task Manager";
const app = express();

//middleware
app.use(express.json());//converts any data that needs to be converted to json file. 

//data model (schema)
const tasks = require("./task");


//define a route
app.get("/tm/tasks", async (req, res) => {
    try {
        const taskList = await tasks.find();
        console.log("get request worked");
        
        res.status(200).json({taskList});
    } catch {
        res.status(500).json({msg: error});
    }
});

app.post("/tm/tasks", async (req,res) =>{
    try{
        console.log("hi");
        const item = new tasks({
           name: "Feed LEO",
           completed: true,
        });
        await item.save();
        console.log(`${item} successfully added to db`);
        res.status(200).json({item});

    } catch(error){
        res.status(500).json({msg: error});
    }
})



//connect to database and start node server
(async function () {
    try {
        await connectDB();
        app.listen(port, () => console.log(`${appName} is listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}) ();