const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = process.env.JWT_SECRET;


async function register(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user){
    console.log('Got an error in the register controller')
    return res
            .status(400)
            .send({ error: '401', message: 'User already exists' });
  }
  try {
    if (password === '') {
      res.send("Invalid Password!")
    }
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      designation: req.body.designation,
      email: req.body.email,
      password: await bcrypt.hash(password, 8)
    });
    const { _id } = await newUser.save();
    const accessToken = jwt.sign({ _id }, secret, { expiresIn: "7d" });
    res.setHeader("Authorization", "Bearer " + accessToken);
    res
      .status(200)
      .send({ error: '200', message: 'Successfully added user',newUser})
  } catch (error) {
    res
      .status(400)
      .send({ error, message: 'Could not create user' });
      console.log(error)
  }
};


async function login (req, res){
  try {
    const { email, password } = req.body;
    if (!email) {
      res
        .status(401)
        .send("Invalid email!");
    } else if (!password)  {
      res
        .status(401)
        .send("Invalid password!");
    } 
    
    const user = await User.findOne({ email: email }); 
    if(user) {
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        const accessToken = jwt.sign({ _id: user._id }, secret, { expiresIn: "7d" });
        res
          .setHeader("Authorization", "Bearer " + accessToken)
          .status(200)
          .send({ error: '200', message: 'Successfully LOGGED IN',user});
      } else {
        res
          .status(401)
          .send("Incorrect credentials.");
    }
    } else {
      res
        .status(403)
        .send("You are not registered yet.");
    }
    
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Incorrect username or password' });
  }
};

async function registerAdmin (req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (user){
    return res
            .status(400)
            .send({ error: '400', message: 'User already exists' });
  }
  try {
    if (password === '') {
      res.send("Invalid Password!")
    }
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      designation: req.body.designation,
      email: req.body.email,
      password: await bcrypt.hash(password, 8),
      usertype: 'admin'
    });
    const { _id } = await newUser.save();
    const accessToken = jwt.sign({ _id }, secret, { expiresIn: "7d" });
    res.setHeader("Authorization", "Bearer " + accessToken);
    res
      .status(200)
      .send({ error: '200', message: 'Successfully added user',newUser})
  } catch (error) {
    res
      .status(400)
      .send({ error, message: 'Could not create user' });
      console.log(error)
  }
};

module.exports = { register, login, registerAdmin };