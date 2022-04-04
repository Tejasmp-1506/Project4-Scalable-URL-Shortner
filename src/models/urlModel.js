const mongoose = require("mongoose")


const urlSchema = new mongoose.Schema({
    
     urlCode: {
        type: String,
        unique : true, 
        lowercase : true,
        trim : true 
        },

     longUrl: {
        type : String,
        required : true,
        // isValidURL: true
        }, 

     shortUrl: {
        type : String,
        unique : true} 
})

module.exports = mongoose.model('Url', urlSchema) //creating a model from schema and exporting it