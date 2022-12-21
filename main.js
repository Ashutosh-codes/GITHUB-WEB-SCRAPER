const url = "https://github.com/topics";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const repoObj = require("./repos");

request(url, function (err, response, html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }
    else{
        extractHTML(html);
    }
});

function extractHTML(html){
    let $ = cheerio.load(html);
    let topics = $(".flex-items-stretch a");
    
    for(let i=0; i<topics.length; i++){
        let link = $(topics[i]).attr("href");
        let topicName = link.split("/")[2];
        dirCreator(topicName);
        link = "https://github.com" + link;
        repoObj.getRepos(link, topicName);
    }
}

function dirCreator(topicName){
    let dirPath = path.join(__dirname, topicName);
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
}