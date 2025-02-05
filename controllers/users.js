const User = require('../models/user.js');


module.exports.renderSignupForm=(req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signup=(async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser = new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log("Registration successful!!", registerUser);
    //When the login operation completes, user will be assigned to req.user.
    req.login(registerUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success',"Welcome To Wanderlust!!");
        res.redirect('/listings');
    })

})

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
}

module.exports.login=async(req,res)=>{
    // res.send('Welcome To Wanderlust!You Are Logged In!');
    req.flash('success', "Welcome To Wanderlust!You Are Logged In!");
    //Always Uses Locals With response
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect( redirectUrl );
}

module.exports.logout=async (req, res) => {
    //Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/listings');
    });
}