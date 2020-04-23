const mongoose = require('mongoose')           
                                               
const databaseConnectionUrl = process.env.MONGODB_URL  
                                               
mongoose.connect(databaseConnectionUrl, {              
    useNewUrlParser: true,                     
    useCreateIndex: true,                      
    useUnifiedTopology: true,                  
    useFindAndModify: false                    
}).then(() => console.log('db connected!')).catch(e => console.log('unable to connect!', e))                          