const express=require("express");
const app =express();
const cors=require("cors")
const mongodb=require("mongodb")
const mongoClient= mongodb.MongoClient
const URL="mongodb+srv://midhun_kumar:admin123@cluster0.vdqbweb.mongodb.net/?retryWrites=true&w=majority"
const DB="mongo"




//middleware
app.use(express.json())
app.use(cors({
  origin:"http://localhost:3001"
}))



app.post("/user",async function(req,res){
    // console.log(req.body)
    // users.push(req.body)
    // req.body.id=users.length
    // res.json({message:"user created success"})
   try {
      //step1:connection between nodejs and mongo db
    const connection= await mongoClient.connect(URL)

    //step2:select the db
    const db= connection.db (DB)
   
    //step3&4 :select the collection and do the operations
    const resUser= await db.collection("users").insertOne(req.body);

    //step5 close the connection
      await connection.close()
     
       res.status(200).json({message:"data inserted"})
    }catch (error) {
      console.log(error)
      res.status(500).json({massage:"something went wrong"})
      }
     

})

app.get("/users",async function(req,res){
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
    console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
    
})

app.get("/user/:id",async function(req,res){
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
    console.log(error)
    res.status(500).json({message:"something went wrong"})
  }
    
})



app.put("/edit/:id",async function(req,res){
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
       const resUser=await db.collection("users").findOneAndUpdate({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
       //step5:
       await connection.close();
        res.status(200).json({message:"data edited"})
      } catch (error) {
           console.log(error)
           res.status(500).json({message:"something went wrong"})
      }

  })

app.delete("/delete/:id",async function(req,res){
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
       const resUser=await db.collection("users").findOneAndDelete({_id:mongodb.ObjectId(req.params.id)})
       //step5:
       connection.close();
       res.status(200).json({message:"data deleted"})
      } catch (error) {
       console.log(error)
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

app.listen(process.env.PORT||3000);
// console.log(process)