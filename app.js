var bodyParser=require("body-parser"),
methodOverride=require("method-override")
// expressSanitizer=require("express-sanitizer"),
    express   =require("express"),
    mongoose  =require("mongoose"),
    app=express();

     // confiqure mongodb
     //{
     mongoose.connect("mongodb://localhost/restful_blog_app");

    //setting ejs as view engine;

     app.set("view engine","ejs");
    // app.use(expressSanitizer());
     app.use(methodOverride("_method"));
     app.use(express.static("public"));
     app.use(bodyParser.urlencoded({extended:true}));


    //mongo schema

    var blogSchema=new mongoose.Schema({
    	title: String,
    	image:String,
    	body :String,
    	created: {type :Date, default: Date.now}
    });

    //mongo/model

    var Blog=mongoose.model("Blog",blogSchema);
    //}

    app.get("/",function(req,res){
        res.redirect("/blogs");
    });
    //index
    app.get("/blogs",function(req,res){
    	Blog.find({},function(err,blogs){
            if (err){
            	console.log("ERROR!");
            } else{
            	res.render("index",{blogs:blogs});
            }
    	});
    });

   

     //new route
       app.get("/blogs/new",function(req,res){
                res.render("new");
       });
     // create route
     app.post("/blogs",function(req,res){
          // req.body.blog.body=req.sanitizer(req.body.blog.body);
           Blog.create(req.body.blog,function(err , newBlog){
                if(err){
                    res.render("new");
                } else {
                	//then redirect to the index
                	res.redirect("/blogs");
                }
           });
     });

     // show route
     app.get("/blogs/:id",function(req,res){
        Blog.findById(req.params.id,function(err,foundBlog){
             if (err)
             {
             	res.redirect("/blogs");
             }else{
             	res.render("show",{blogs: foundBlog});
             }
        });
     });

     //edit route
     app.get("/blogs/:id/edit",function(req,res){
          Blog.findById(req.params.id,function(err,foundBlog){
                  if (err) {
                  	res.redirect("/blogs");
                  } else {
                  	res.render("edit",{blogs:foundBlog});
                  }
          });
     });


     //update

      app.put("/blogs/:id",function(req,res){
           Blog.findByIdAndUpdate(req.params.id, req.body.blogs,function(err,updatedBlog){
               if(err){
                  res.redirect("/blogs");
               } else {
                   res.redirect("/blogs/"+req.params.id);
               }
           });
      });

      // DELETE ROUTE
      app.delete("/blogs/:id",function(req,res){
          //destroy blog
          Blog.findByIdAndRemove(req.params.id,function(err){
              if (err) {
                res.redirect("/blogs");
              } else {
                res.redirect("/blogs");
              }
          });
          //redirect somewhere else
      });
       //setup local host

     app.listen(3000,function(){
     	console.log("app has started");
     });