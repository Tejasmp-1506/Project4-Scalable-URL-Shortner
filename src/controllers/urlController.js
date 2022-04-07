const express = require('express')
const validUrl = require('valid-url')
const shortid = require('short-id')
const urlModel = require("../models/urlModel")
const redis = require("redis");

const { promisify } = require("util");


const redisClient = redis.createClient(
    16368,
    "redis-16368.c15.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("Y52LH5DG1XbiVCkNC2G65MvOFswvQCRQ", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis...........");
  });
  
  
  
  //1. connect to the server
  //2. use the commands :
  
  //Connection setup for redis
  
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
  


const baseUrl = "http://localhost:3000"


//--------creating a short url from a long url-----------------------------------------------------------------------

const createShortUrl = async function(req, res){
    try{   
    const {longUrl} = req.body   //destructuring

    if(!longUrl) return res.status(400).send({status : false , msg : "please provide url"})

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

               const newUrl = new urlModel({longUrl, shortUrl, urlCode})
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


//---------get url from url code----------------------------------------------------------------------------------------------


const getUrl = async function(req, res){
   try{
         const urlCode = req.params.urlCode

         if(!urlCode) return res.status(400).send({status : false, msg : "please provide urlCode"})

        const data = await urlModel.findOne({urlCode})


        if(data){
         res.status(200).redirect(data.longUrl)

        }else{
         res.status(400).send({status : false, msg : "no url found"})
        }
      }
   catch(err){
        res.status(500).send({status: false, msg: err.message})
   }
}



module.exports = {createShortUrl, getUrl }