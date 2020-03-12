require('dotenv').config();
var amqpurl=process.env.MQURL;
var amqp = require('amqplib/callback_api');
var ch=null;
function sendDatatoQueue(cb){    
    amqp.connect(amqpurl,(err,connection)=>{       
         const bindKey='chain';        
         if(err){            
             console.log('Error at creating connection to queue--',err);
            }        
        console.log('Created connection successfully');        
        connection.createChannel((err,channel)=>{            
            ch=channel;            
            if(err){                
                console.log('Error at creating channel to queue--',err);            
            }            
            console.log('Created channel successfully');            
            console.log('Ready to send data to queue');            
            let exchange='multichain';            
            channel.assertExchange(exchange,'direct',{durable:false});             
            function sendData(data){                
                let bufferData={};                
                if(typeof data=='string'){                    
                    bufferData=Buffer.from(data);                   
                }                
                else if(typeof data=='object'){                    
                    bufferData=Buffer.from(JSON.stringify(data));                
                }               
                channel.publish(exchange,bindKey,bufferData);                
                console.log('Data sent to queue');            
            }            
            cb(sendData);        
        });    
    });
}
process.on('exit',(code)=>{    
    console.log('Closing conection to queue');    
    ch.close();
});
module.exports=sendDatatoQueue; 