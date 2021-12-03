const express = require('express');
const cors=require('cors');
const app=express();
app.use(cors());
const http = require('http');

const server=http.createServer(app);

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>
{
    res.send("Server is running");
})

const io=require('socket.io')(server,{
        cors: 
        {
            origin:"*",
            methods:['GET','POST']
        }
})
    
io.on("connection",(socket)=>
{
    socket.emit('me',socket.id); //our own id
    socket.on('disconnect',()=>
    {
        socket.broadcast.emit("callended");
    })
    socket.on("calluser",({userToCall,signalData,from,name})=> //want to call
    {
        io.to(userToCall).emit('calluser',{signal:signalData,from,name});
    })
    socket.on("answercall",(data)=>
    {
        io.to(data.to).emit("callaccepted",data.signal);
    })

})



server.listen(PORT,()=>
{
    console.log("Server is runnig on PORT 5000")
})