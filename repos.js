const url = "https://github.com/topics/jekyll";
const cheerio = require("cheerio");
const request = require("request");
const issueObj = require("./issues");
const fs = require("fs");
const path =require("path");

function getRepos(url, topic){
    request(url, function(err, response, html){
        if(err){
            console.log(err);
        } else if(response.statusCode == 404){
            console.log("page not found");
        }
        else{
            extractRepos(html, topic);
        }
    });
}

function extractRepos(html, topic){
    let $ = cheerio.load(html);
    let repos = $("h3.f3");
    for(let i=0; i<Math.min(repos.length,8); i++){
        let repoLink = $(repos[i]).find("a");
        repoLink = $(repoLink[1]).attr("href");
        let repoName = repoLink.split("/")[2];
        repoLink = "https://github.com" + repoLink;
        issueObj.getIssues(topic, repoName, repoLink);
        // let stringIssue = JSON.stringify(issues);
        // console.log(stringIssue);
        // writeIssues(topic, repoName, stringIssue);
    }
}



module.exports = {
    getRepos : getRepos
}