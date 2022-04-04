const express = require('express')
const validUrl = require('valid-url')
const shortid = require('short-id')
const urlModel = require("../models/urlModel")


const baseUrl = "http://localhost:3000"

const createShortUrl = async function(req, res){
    try{   
    const {longUrl} = req.body

       if(!validUrl.isUri(baseUrl)){
           return res.status(400).send({status : false , msg : "invalid base url"})
       }
       
       const urlCode = shortid.generate()

       if(validUrl.isUri(longUrl)){
            let url = await urlModel.findOne({longUrl})
            if(url) {
                return res.status(400).send({status : false , msg : "Url already exist"})
            } else{
                const shortUrl = baseUrl + '/' + urlCode

                newUrl = new urlModel({longUrl, shortUrl, urlCode})
                await newUrl.save()
                res.status(201).send({status : true, data: newUrl})
            }
           
       } else {
           res.status(400).send({status: false , msg : " please provide valid url"})
       }
    
    }
    catch(err){
        res.status(500).send({status : false, msg : err.message})
    }

}


module.exports.createShortUrl = createShortUrl