const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const authenticateSuperAdmin = require("../middleware/authenticateSuperAdmin");
const cokie = require ('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
router.use(cokie());
const bcrypt = require("bcryptjs");
require('../db/connect'); 
const User = require("../models/userschema");
const Admin = require("../models/adminschema");
const SuperAdmin = require("../models/superadminschema");

router.get('/', (req, res) => {
    res.send("Hello from server");
});

//user Register
router.post('/register', async (req, res) => {
const { name, email, phone, password, cpassword} =req.body;

    if(!name || !email || !phone || !password || !cpassword)
    {
        return res.status(422).json({error: "plz add info full"});
    }
    else{
    try
    {
        const userExist = await User.findOne({email:email});

        if(userExist) {
            return res.status(422).json({error: "Email already exists"});
        } else if(password!==cpassword)
        {
            return res.status(422).json({error: "Passwords not matching"});
        }
        else {
            
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

            const user = new User({
              name,
              email,
              phone,
              password: hashedPassword,
              cpassword: hashedPassword,
            });

            const userRegister = await user.save();

            if(userRegister) {
                
                return res.status(500).json({message: "Regist Successful"});
            } else {
                return res.status(422).json({error: "Regist Fail"});
            } 
        }

    } catch(err) {
        console.log(err);
    }
    }

    
});

//admin Register
router.post('/registerAdmin', async (req, res) => {
    console.log("AT endpoint",req)    
    const { name, email, password, cpassword} = req.body;
    
        if (!name || !email || !password || !cpassword)
        {
            return res.status(422).json({error: "plz add info full"});
        }
        else{
        try
        {
            const adminExist = await Admin.findOne({email:email});
    
            if(adminExist) {
                return res.status(422).json({error: "Email already exists"});
            } else if(password!==cpassword)
            {
                return res.status(422).json({error: "Passwords not matching"});
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

                const admin = new Admin({
                  name,
                  email,
                  password: hashedPassword,
                  cpassword: hashedPassword,
                });
                
                const adminRegister = await admin.save();
    
                if(adminRegister) {
                    return res.status(500).json({message: "Regist Successful"});
                } else {
                    return res.status(422).json({error: "Regist Fail"});
                } 
            }
        } catch(err) {
            console.log(err);
        }
        }
    });

//super admin Register
router.post('/registerSuperAdmin', async (req, res) => {
console.log(req)
    const { name, email, password, cpassword} = req.body;
    
        if (!name || !email || !password || !cpassword)
        {
            return res.status(422).json({error: "plz add info full"});
        }
        else{
        try
        {
            const SuperAdminExist = await SuperAdmin.findOne({email:email});
    
            if(SuperAdminExist) {
                return res.status(422).json({error: "Email already exists"});
            } else if(password!==cpassword)
            {
                return res.status(422).json({error: "Passwords not matching"});
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

                const superAdmin = new SuperAdmin({
                  name,
                  email,
                  password: hashedPassword,
                  cpassword: hashedPassword,
                });
                
                const SuperAdminRegister = await superAdmin.save();
    
                if(SuperAdminRegister) {
                    return res.status(500).json({message: "Regist Successful"});
                } else {
                    return res.status(422).json({error: "Regist Fail"});
                } 
            }
        } catch(err) {
            console.log(err);
        }
        }
    });

//userlogin 
router.post('/signin', async (req, res)=> {
    try {
        let token;
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ error: "Plz fill the data" })
        }

        const userLogin = await User.findOne({ email:email });

        if(userLogin)
        {
            var isMatch = await bcrypt.compare(password, userLogin.password);
        }

        if(userLogin)
        {
            token = await userLogin.generateAuthToken();
            console.log(token);
            console.log("token")

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch)
            {
                res.status(400).json({ error: "Invalid Credentials pass"});
            }
            else {
                res.json({ message: "Sign in successful"});
            }
        }
        else{
            res.status(400).json({ error: "Invalid Credentials email"});
        }
    } catch(err) {
        console.log(err);
    }
});

//Adminlogin 
router.post('/signinAdmin', async (req, res)=> {
    try {
        let token;
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ error: "Plz fill the data" })
        }

        const userLogin = await Admin.findOne({ email:email });

        if(userLogin)
        {
            var isMatch = await bcrypt.compare(password, userLogin.password);
        }

        if(userLogin)
        {
            token = await userLogin.generateAuthToken();
            console.log(token);
            console.log("token")

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch)
            {
                res.status(400).json({ error: "Invalid Credentials pass"});
            }
            else{
                res.json({ message: "Sign in successful"});
            }
        }
        else{
            res.status(400).json({ error: "Invalid Credentials email"});
        }
    } catch(err) {
        console.log(err);
    }
});

//SuperAdminlogin 
router.post('/signinSuperAdmin', async (req, res)=> {
    try {
        let token;
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ error: "Plz fill the data" })
        }

        const SuperAdminLogin = await SuperAdmin.findOne({ email:email });

        if(SuperAdminLogin)
        {
            var isMatch = await bcrypt.compare(
              password,
              SuperAdminLogin.password
            );
        }

        if(SuperAdminLogin)
        {
            token = await SuperAdminLogin.generateAuthToken();
            console.log(token);
            console.log("token")

            res.cookie("jwtoken", token, {
                expires:new Date(Date.now() + 25892000000),
                httpOnly:true
            });

            if(!isMatch)
            {
                res.status(400).json({ error: "Invalid Credentials pass"});
            }
            else{
                res.json({ message: "Sign in successful"});
            }
        }
        else{
            res.status(400).json({ error: "Invalid Credentials email"});
        }
    } catch(err) {
        console.log(err);
    }
});

router.get('/AdminHome', authenticateAdmin, (req, res) => {
    res.send(req.rootAdmin);
});

router.get('/UserHome', authenticate, (req, res)=>{
    res.send(req.rootUser);
});

router.get('/SuperAdminHome', authenticateSuperAdmin, (req, res)=>{
    res.send(req.rootSuperAdmin);
});

//Get user data for daily activity page
router.get('/DailyActivity', authenticate, (req, res)=>{
    res.send(req.rootUser);
});

router.post('/DailyActivityPost', authenticate, async (req, res)=>{
    try {
        const {foodIntake, steps} = req.body; 

        if(!foodIntake || !steps)
        {
            console.log("error in activity form");
            return res.json({error: "plz fill full activity"}); 
        }

        const userActivity = await User.findOne({ _id: req.userID });

        if(userActivity)
        {
            const userAct = await userActivity.addAct(foodIntake, steps);
            
            await userActivity.save();

            res.status(201).json({message:"Activity saved succesful"});
        }


    } catch(error) {
        console.log(error);
    }
});

// Handle payment request
router.post('/Payment', async (req, res) => {
    const { amount, userData } = req.body;
    console.log(userData);
    try {
      const payment = await stripe.charges.create({
        amount: amount,
        currency: 'USD',
        source: 'tok_visa', //this is just for testing purpose, we need to assign user's token then when we want to live this website
        description: 'Payment for premium feature in MealMaven',
      });
  
      // Update user's account to indicate they have access to the premium feature
      const user = await User.findOne({ _id: userData._id });

        if(user)
        {
            user.hasPremiumAccess = true;
            user.premiumObtainedOn = new Date();
            await user.save();
        }
      console.log("success");
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error });
    }
  });

//Update User Profile
router.put('/updateProfileUser/:email', async (req, res) => {
    const { email } = req.params;
    const { name, phone } = req.body;
  
    const updatedFields = {};
  
    if (name) updatedFields.name = name;
    // if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
  
    try {
      const user = await User.findOneAndUpdate(
        { email },
        updatedFields,
        { new: true }
      );
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'error' });
    }
  });

//Update Nutritionist Profile
router.put('/updateProfileAdmin/:email', async (req, res) => {
    const { email } = req.params;
    const { name, phone } = req.body;
  
    const updatedFields = {};
  
    if (name) updatedFields.name = name;
    // if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
  
    try {
      const admin = await Admin.findOneAndUpdate(
        { email },
        updatedFields,
        { new: true }
      );
      res.json(admin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'error' });
    }
  });

//Update Super Admin Profile
router.put('/updateProfileSuperAdmin/:email', async (req, res) => {
    const { email } = req.params;
    const { name, phone } = req.body;
  
    const updatedFields = {};
  
    if (name) updatedFields.name = name;
    // if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
  
    try {
      const superadmin = await SuperAdmin.findOneAndUpdate(
        { email },
        updatedFields,
        { new: true }
      );
      res.json(superadmin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'error' });
    }
  });

module.exports = router;