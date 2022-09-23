const express=require("express");
const app =express();
const cors=require("cors")

let users=[];

//middleware
app.use(express.json())
app.use(cors({
  origin:"http://localhost:3001"
}))

// app.get("/home",function(req,res){
//     res.json({message:"success..."})
// })

// app.get("/contact",function(req,res){
//     res.json({message:"contact..."})
// })

app.post("/user",function(req,res){
    console.log(req.body)
    users.push(req.body)
    req.body.id=users.length
    res.json({message:"user created success"})
})

app.get("/users",function(req,res){
    res.json(users)
})

app.get("/user/:id",function(req,res){
//    console.log(req.params.id)
  let objId = req.params.id
  let user=users.find((item)=> item.id==objId)
  if(user){
    res.json(user)
  }else{
    res.json({message:"user not found"})
  }
})


app.put("/edit/:id",function(req,res){
    // console.log(req.params.id)

    let editId=req.params.id
    let userIndex=users.findIndex((item)=>item.id==editId)

    Object.keys(req.body).forEach((item)=>{
        users[userIndex][item]=req.body[item]
   })
   if(userIndex!=-1){
      res.json({message:"done"})
   }else{
    res.json({message:"user not found"})
   }
  })

app.delete("/delete/:id",function(req,res){
    let delId=req.params.id
    let userIndex=users.findIndex((item)=>item.id==delId)
    if(userIndex!=-1){
    users.splice(userIndex,1)
    res.json({message:"user deleted"})
    }else{
        res.json({message:"user not found"})
    }
})

app.get("/query",function(req,res){
    let qparms=req.query
    // console.log(qparms)
    let resUser=[];  //limit 2 offset 3  //for(let i=3;i<5;i++)
    for(let i=parseInt(req.query.offset);i<parseInt(req.query.offset+req.query.limit);i++){
        
       if(users[i]){
        resUser.push(users[i])
       }
    }
    res.json(resUser)

})

app.listen(process.env.PORT|| 3000);
// console.log(process)