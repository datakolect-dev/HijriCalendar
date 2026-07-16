import express from "express";
import axios from "axios";
import fs from "fs";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const USERS_FILE = "./storage/users.json";


// Accueil
app.get("/", (req, res) => {

    res.json({
        status: "Hijri Calendar running"
    });

});


// Installation LaMetric
app.post("/install", (req, res) => {

    const data = req.body;


    let users = [];

    if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(
            fs.readFileSync(USERS_FILE)
        );
    }


    const user = {

        device_id: data.id || "unknown",

        installed_at: new Date().toISOString()

    };


    users.push(user);


    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );


    res.json({

        success: true

    });

});



// Données Hijri
app.get("/hijri", async (req,res)=>{


    try {


        const response = await axios.get(
            "https://api.aladhan.com/v1/gToH"
        );


        const hijri = response.data.data.hijri;


        res.json({

            frames:[

                {
                    icon:"18433",
                    text:
                    `${hijri.day} ${hijri.month.en}\n${hijri.year} AH`
                }

            ]

        });


    }
    catch(error){

        res.status(500).json({
            error:"Hijri API error"
        });

    }


});

app.post("/uninstall", (req,res)=>{

    const data = req.body;

    let users = [];

    if(fs.existsSync(USERS_FILE)){

        users = JSON.parse(
            fs.readFileSync(USERS_FILE)
        );

    }


    users = users.filter(
        user => user.device_id !== data.id
    );


    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users,null,2)
    );


    res.json({
        success:true
    });

});

app.listen(PORT,()=>{

    console.log(
        `Hijri Calendar running on ${PORT}`
    );

});