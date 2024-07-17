import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const createUser = async (req, res) => {
    try{
        const {userName, password } = req.body;
        const user = new User(req.body);
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists"});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        

     await user.save();
        res.status(201).json({
            status: "success",
            message: "User created successfully"
        })
    } catch (error) {
        res.status(400).send(error);
    }
}

export const signIn = async (req, res) =>{
    try{
        const {userName, password } = req.body;
        if(!userName || !password) {
            return res
            .status(400)
                .json({ message: "Please provide a username and password"});
            
        }
        const user = await User.findOne({ userName });
        if(!user) {
            return res.status(401).json({ message: "Invalid credentials"});
        }
        const isCorrectPassword = await bcrypt.compare
        (password, user.password);
        if (!isCorrectPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user.id},
            process.env.JWT_SECRET_KEY,{
          expiresIn: "1hr"
            })
   res.status(200).json({
    status: "success",
    message: "User logged in sucessfully",
    token,
   });
} catch (err){
    res.status(500).json({
        status:"error",
        message: "An error occurred while trying to login",
    });
}
};
 
export const getAllUsers = async (req, res) => {
    try {
      // Retrieve all users from the database
      const users = await User.find({}, { password: 0 }); // Exclude the password field from the response
      return res.status(200).json({ users });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error fetching users" });
    }
  };