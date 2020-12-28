const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const _ = require("lodash");
 
 
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleSchema = {
    title : String,
    content: String
  }
  // creating model 
  const Article = mongoose.model("Article", articleSchema);

  // chaining routes to get all articles
  app.route("/articles")
     .get((req, res) =>{
   Article.find((err, foundArticles) =>{
       if(!err){
        res.send(foundArticles)
       }else{
           res.send(err)
       }
   })
   })
    .post((req, res)=>{
    console.log(req.body)
    let newArticle = new Article({
        title : req.body.title,
        content: req.body.content
    });

    newArticle.save((err) =>{
        if(!err){
            res.send("Successfully added new article")
        }else{
            res.send(err)
        }
    });
    })
    .delete((req, res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfully deleted all articles")
        }else{
            res.send(err)
        }
    })
})
 //// chaining routes to get specific article

 app.route("/articles/:articleTitle")
    .get((req, res) =>{
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle)
            }else{
                res.send("No articles matching that title found ")
            }
        })
    })
    .put((req, res) =>{
        Article.update(
            {title: req.params.articleTitle},
            {title : req.body.title, content: req.body.content},
            {overwrite: true},
            (err) =>{
                if(!err){
                   res.send( "Successfully updated")
                }else{
                    res.send(err)
                }
            }
            )
    })
    .patch((req,res) =>{
        Article.update(
            {title: req.params.articleTitle},
            {$set : req.body},
            (err) =>{
                if(!err){
                   res.send( "Successfully updated")
                }else{
                    res.send(err)
                }
            }
            )
    })
    .delete((req, res) =>{
        Article.deleteOne({title: req.params.articleTitle}, (err)=>{
            if(!err){
                res.send("Successfully deleted article")
            }else{
                res.send(err)
            }
        })
    });
    
app.listen(3000, () =>{
   console.log("Server is running")
});


