const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const pdfkit = require("pdfkit");

function getIssues(topic, repoName, url){
    request(url, function(err, response, html){
        if(err){
            console.log(err);
        }else if(response.statusCode == 404){
            console.log("page not found");
        }
        else{
            console.log(url);
            gotoIssues(topic, repoName, html);
        }
    });
}

function gotoIssues(topic, repoName, html){
    let $ = cheerio.load(html);
    let issueLink = "https://github.com" +  $("#issues-tab").attr("href");
    extractIssues(topic, repoName, issueLink);
}

function extractIssues(topic, repoName, issueLink){
    request(issueLink, function(err, response, html){
        if(err){
            console.log(err);
        }else{
            getIssueLink(topic, repoName, html);
        }
    });
}

function getIssueLink(topic, repoName, html){
    let $ = cheerio.load(html);
    let issues = $("a[data-hovercard-type = 'issue']");
    let issueArr = [];
    for(let i=0; i<issues.length; i++){
        let link = "https://github.com" + $(issues[i]).attr("href");
        issueArr.push(link);
    }
    // issueArr = issueArr.toString();
    let stringIssues = JSON.stringify(issueArr);
    writeIssues(topic, repoName, stringIssues);
}

function writeIssues(topic, repoName, issues){
    let dirPath = path.join(__dirname,topic);
    let filePath = path.join(dirPath, repoName) + '.pdf';
    let pdfDoc = new pdfkit();
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(issues);
    pdfDoc.end();
}

module.exports = {
    getIssues : getIssues
}