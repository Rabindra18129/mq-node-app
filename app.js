var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var MQ=require('./mqHandler');
var port =process.env.PORT||3000;
var mqHandler=null;
MQ((resp)=>{
    mqHandler=resp;
});
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.status(200).send('Hello');
});
app.post('/send',(req,res)=>{
    console.log('Incoming Data-->',req.body);
    mqHandler(req.body);
    res.status(200).send('Data sent to queue');
});

app.use((req,res)=>{    
    res.status(500).send('Not Found');
});
app.use((err,req,res)=>{    
    res.status(500).send(err.message);
});
setTimeout(()=>{    
    app.listen(port,()=>{        
        console.log(`Server started at port ${port}`);    
    });},2000); 