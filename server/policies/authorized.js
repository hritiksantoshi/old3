var jwt = require('jsonwebtoken');
//const universalFunction=require('../lib/universal-function');
var isuserAuth = (req,res,next)=>{
    try{
        var token = req.headers.authorization.split(" ")[1];
        
        var decode = jwt.verify(token, 'qwertyuioplkjhgfdsazxcvbnmlkjhgfdsa',function(err,decode){

            if(err) throw res.send("unauthorized");

            req.userData = decode;
            next();
            

        })
       
        
    }
    catch(error){
        res.status(401).json({
            error:"invalid token"
        })
    }
}

module.exports ={
    userAuth : isuserAuth 
}