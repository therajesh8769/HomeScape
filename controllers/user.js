const User=require("../models/user.js");

module.exports.signupForm=async(req,res)=>
    {
        res.render('users/signup.ejs');
    };
    module.exports.signup=async(req,res)=>
        {
           try{
            const user=req.body.user;
           if(!user)
            {
                throw new ExpressError(400,"Error! send valid data");
            }
            const {username,email,password}=user;
            if (!username || !email || !password) {
                throw new ExpressError(400, "Error! Username, email, and password are required");
            }
    
        
            const newUser= new User({username,email});
          const res5=  await User.register(newUser,password);
            req.login(res5,(err)=>
            {
                if(err)
                    {
                       return next(err);
                    }
                    req.flash("success","Welcome to wonderlust!");
    
            res.redirect("/listings");
    
            })  
            
           }
            catch(e)
            {
                req.flash("error",e.message);
                res.redirect("/signup");
            }
         
         
        };
        module.exports.loginForm=(req,res)=>
            {
                res.render("users/login.ejs");
            };
        module.exports.login=async(req,res)=>
            {   
                req.flash("success","welcome to wanderlust u r logged in ");
                if(!res.locals.redirectUrl)
                    {
                        return res.redirect("/listings")
                    } 
                res.redirect(res.locals.redirectUrl);
            };
            module.exports.logout=(req,res,next)=>
                {
                    req.logout((err)=>
                    {
                        if(err)
                            {
                               return  next(err);
                            }
                            req.flash("success","you are logged out");
                            res.redirect("/listings");
                    });
                };