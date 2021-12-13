const express=require('express');
const app=express();
const { google } = require("googleapis");
const fetch = require('cross-fetch');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/assets')));
app.use(methodOverride("_method"));
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


const serviceAccount = require('./key.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const colRef = db.collection('2021-12-04')



let dataRetreived=false;
let encodings=[];
let names=[];
let enrolls=[];

async function fetching(names,image,encodings){
    const response=await fetch('https://attendance1api.herokuapp.com/test',{
        method:'POST',
        body: JSON.stringify({
                enrolls,
                image,
                encodings,
                trueEnroll
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const data=await response.json();
    return data;
}


async function fetching_2(image){
    const response=await fetch('https://attendance1api.herokuapp.com/registration',{
        method:'POST',
        body: JSON.stringify({
                image, 
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const encoding=await response.json();
    return encoding;
}


// home route
app.get('/',async(req,res)=>{
    data={
        result:'Scan Now',
        scanned:false
    };
    if(!dataRetreived)
    {
        const query=await colRef.get()
        query.forEach(doc=>{
            encodings.push(doc.data().encoding);
            names.push(doc.data().name);
            enrolls.push(doc.data().enroll);
        })
        dataRetreived=true;
    }
    res.render('index',{data});
})

//attendance route
app.post('/mark-attendance',async(req,res)=>{
    
    const {name,image}=req.body;

    if(!dataRetreived)
    {
        const query=await colRef.get()
        query.forEach(doc=>{
            encodings.push(doc.data().encoding);
            names.push(doc.data().name);
            enrolls.push(doc.data().enroll);
        })
        dataRetreived=true;
    }


    idx=names.indexOf(name);
    trueEnroll=enrolls[idx];
    data=await fetching(names,image,encodings,trueEnroll);
    const enroll=data.enroll

    data.detected=data.enroll==trueEnroll;
    if(data.detected)
    {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        today = mm + '/' + dd + '/' + yyyy;
        

        const auth = new google.auth.GoogleAuth({
            keyFile: "sheetkey.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        // Spread sheet api to feed attendance detail
        // Create client instance for auth
        const client = await auth.getClient();

        // Instance of Google Sheets API
        const googleSheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetId = "173xQ-TKuLNsArTU2qjch-tZ_3e9nGuANRxTxQNKawV0";

        // Write row(s) to spreadsheet
        googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:D",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[enroll,name,today,time]],
        },
        });
    }
    data['scanned']=true;
    res.render('index',{data});

})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async(req,res)=>{
    const {name,image,enroll,phone}=req.body
    const data=await fetching_2(image)
    await colRef.add({
        name,
        image,
        encoding:data['encoding'],
        enroll,
        phone
      });
    encodings.push(data['encoding']);
    enrolls.push(enroll);
    names.push(name);
    res.redirect('/')
})

app.listen(process.env.PORT || 3000,()=>{
    console.log('serving 3000 port ')
});