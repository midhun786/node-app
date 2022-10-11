const express=require("express");
const app =express();
const cors=require("cors")
const mongodb=require("mongodb")
const jwt= require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotenv=require("dotenv").config()
const mongoClient= mongodb.MongoClient
const URL=process.env.DB
const DB="mongo"



//middleware
app.use(express.json())

//For cors policy error package
app.use(cors({
  origin:"https://harmonious-sprite-2021eb.netlify.app"
}))


//----------------------------------- For users-------------------------------------------//
let authenticate=(req,res,next)=>{
    //  console.log(req.headers)
    // res.status(401).json({message:"unauthorized"})
    if(req.headers.authorisation){
      try {
        let decode =jwt.verify(req.headers.authorisation,"jfbaudsgfygsdfyi");
      if(decode){
       next();
      }} catch (error) {
        res.status(401).json({message:"unauthorized"})
      }
    }else{
      res.status(401).json({message:"unauthorized"})
    }
}

app.post("/user",authenticate,async function(req,res){
    // console.log(req.body)
    // users.push(req.body)
    // req.body.id=users.length
    // res.json({message:"user created success"})
   try {
      //step1:connection between nodejs and mongo db
    const connection= await mongoClient.connect(URL)

    //step2:select the db
    const db = connection.db(DB)
   
    //step3&4 :select the collection and do the operations
      await db.collection("users").insertOne(req.body);

    //step5 close the connection
      await connection.close()
     
       res.status(200).json({message:"data inserted"})
    }catch (error) {
      // console.log(error)
      res.status(500).json({message:"something went wrong"})
      }
     

})

app.get("/users",authenticate,async function(req,res){
  try{
    //step1:
      const connection = await mongoClient.connect(URL)
  //step2:
    const db = connection.db(DB) 
    //step3& 4
    const users=await db.collection("users").find().toArray();
    //step5:
    await connection.close()

     res.json(users)
  }catch(error){
    // console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
    
})

app.get("/user/:id",authenticate,async function(req,res){
  //  console.log(req.params.id)
  // let objId = req.params.id
  // let user=users.find((item)=> item.id==objId)
  // if(user){
  //   res.json(user)
  // }else{
  //   res.json({message:"user not found"})
  // }
  try{
    //step1:
      const connection = await mongoClient.connect(URL)
  //step2:
    const db = connection.db(DB) 
    //step3& 4
    const users=await db.collection("users").findOne({_id:mongodb.ObjectId(req.params.id)});
    //step5:
    await connection.close()

    res.json(users)
  }catch(error){
    // console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
    
})



app.put("/edit/:id",authenticate,async function(req,res){
    // console.log(req.params.id)

  //   let editId=req.params.id
  //   let userIndex=users.findIndex((item)=>item.id==editId)

  //   Object.keys(req.body).forEach((item)=>{
  //       users[userIndex][item]=req.body[item]
  //  })
  //  if(userIndex!=-1){
  //     res.json({message:"done"})
  //  }else{
  //   res.json({message:"user not found"})
  //  }
  try {
    
  
      //step1:
       const connection=await mongoClient.connect(URL);
       //step2:
       const db=connection.db(DB);
       //step3&4:
      await db.collection("users").findOneAndUpdate({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
       //step5:
       await connection.close();
        res.status(200).json({message:"data edited"})
      } catch (error) {
          //  console.log(error)
           res.status(500).json({message:"something went wrong"})
      }

  })

app.delete("/delete/:id",authenticate,async function(req,res){
    // let delId=req.params.id
    // let userIndex=users.findIndex((item)=>item.id==delId)
    // if(userIndex!=-1){
    // users.splice(userIndex,1)
    // res.json({message:"user deleted"})
    // }else{
    //     res.json({message:"user not found"})
    // }
    try {
       //step1:
       const connection=await mongoClient.connect(URL)
       //step2:
       const db=connection.db(DB);
       //step3&4:
        await db.collection("users").findOneAndDelete({_id:mongodb.ObjectId(req.params.id)})
       //step5:
       connection.close();
       res.status(200).json({message:"data deleted"})
      } catch (error) {
      //  console.log(error)
       res.status(500).json({message:"something went wrong"})
    }

})

// app.get("/query",function(req,res){
//     let qparms=req.query
//     // console.log(qparms)
//     let resUser=[];  //limit 2 offset 3  //for(let i=3;i<5;i++)
//     for(let i=parseInt(req.query.offset);i<parseInt(req.query.offset+req.query.limit);i++){
        
//        if(users[i]){
//         resUser.push(users[i])
//        }
//     }
//     res.json(resUser)

// })

//-----------------------------for products----------------------------------//
//  let products =[];
app.post("/product",async function(req,res){
 
  // console.log(req.body)
  // products.push(req.body)
  // req.body.id=products.length
  // res.json({message:"products created"})
 try {
    //step1:connection between nodejs and mongo db
  const connection= await mongoClient.connect(URL)

  //step2:select the db
  const db = connection.db(DB)
 
  //step3&4 :select the collection and do the operations
    await db.collection("products").insertOne(req.body);

  //step5 close the connection
    await connection.close()
   
     res.status(200).json({message:"data inserted"})
  }catch (error) {
    // console.log(error)
    res.status(500).json({message:"something went wrong"})
    }
  })
  
  app.get("/products", async function(req,res){
    // res.json(products)
      try{
    //step1:
      const connection = await mongoClient.connect(URL)
  //step2:
    const db = connection.db(DB) 
    //step3& 4
    const users=await db.collection("products").find().toArray();
    //step5:
    await connection.close()

     res.json(users)
  }catch(error){
    // console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
  })

  app.get("/product/:id",async function(req,res){
  //   console.log(req)
  //   console.log(req.params.id)
  //   let productId=req.params.id;

  //   let proId= products.find((item)=>item.id==productId)
  //  if(proId){
  //     res.json(proId)
  //   }else{
  //     res.json({message:"user not found"})
  //   }
    try{
    //step1:
      const connection = await mongoClient.connect(URL)
  //step2:
    const db = connection.db(DB) 
    //step3& 4
    const users=await db.collection("products").findOne({_id:mongodb.ObjectId(req.params.id)});
    //step5:
    await connection.close()

    res.json(users)
  }catch(error){
    // console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
   
  })
  
app.put("/proedit/:id",async function(req,res){
  //   console.log(req.params.id)

  //   let editId=req.params.id
  //   let userIndex=products.findIndex((item)=>item.id==editId)

  //   Object.keys(req.body).forEach((item)=>{
  //       products[userIndex][item]=req.body[item]
  //  })
  //  if(userIndex!=-1){
  //     res.json({message:"done"})
  //  }else{
  //   res.json({message:"user not found"})
  //  }
  try {
      //step1:
       const connection=await mongoClient.connect(URL);
       //step2:
       const db=connection.db(DB);
       //step3&4:
      await db.collection("products").findOneAndUpdate({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
       //step5:
       await connection.close();
        res.status(200).json({message:"data edited"})
      } catch (error) {
          //  console.log(error)
           res.status(500).json({message:"something went wrong"})
      }

  })
  app.delete("/prodelete/:id",async function(req,res){
    // let delId=req.params.id
    // let userIndex=users.findIndex((item)=>item.id==delId)
    // if(userIndex!=-1){
    // products.splice(userIndex,1)
    // res.json({message:"user deleted"})
    // }else{
    //     res.json({message:"user not found"})
    // }
    try {
       //step1:
       const connection=await mongoClient.connect(URL)
       //step2:
       const db=connection.db(DB);
       //step3&4:
        await db.collection("products").findOneAndDelete({_id:mongodb.ObjectId(req.params.id)})
       //step5:
       connection.close();
       res.status(200).json({message:"data deleted"})
      } catch (error) {
      //  console.log(error)
       res.status(500).json({message:"something went wrong"})
    }

})


app.post("/register",async function(req,res){
    try{
      let connection= await mongoClient.connect(URL);
      let db= connection.db(DB);

      let salt= await bcrypt.genSalt(10);
      // console.log(salt)
      let Hash= await bcrypt.hash(req.body.password, salt)
      console.log(Hash)
      req.body.password=Hash                          

      let register= await db.collection("userlogin").insertOne(req.body)
      // console.log(req.body)
  
      await connection.close()
      res.json({message:"user registered successfully"})
    }catch(error){
      console.log(error)
      res.json(error)
    }
})

app.post("/login",async function(req,res){
  
  let connection= await mongoClient.connect(URL);
  let db = connection.db(DB);

  let user = await db.collection("userlogin").findOne({email:req.body.email})
  if(user){
    let Compare =await bcrypt.compare(req.body.password,user.password)
  if(Compare){
      
      let token =jwt.sign({_id:user._id},"jfbaudsgfygsdfyi",{expiresIn:"60*60"})
      res.json({token})
      // res.json({message:"logged in successfully"});
    }else{
      res.json({message:"password is wrong"})
    }
  }else{
    res.status(401).json({message:"user email not found"})
  }

})



app.listen(process.env.PORT||4000);
// console.log(process)