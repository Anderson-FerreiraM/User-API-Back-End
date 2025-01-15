const express = require(`express`)
const {PrismaClient} = require(`@prisma/client`)

const prisma = new PrismaClient()
const app = express()
app.use(express.json())

//rota para retornar todos os usuarios 
app.get("/users", async(req, res)=> {
    const users = await prisma.user.findMany()
    res.json(users)
})

// rota para criar um usuario 
app.post("/users", async(req, res) => {
    const {name, email} = req.body;

    if(!name ||!email){
        return res.status(400).json({error:"Name e email são obrigatorio"})
    }

    const user = await prisma.user.create({
        data:{
            name,
            email
        }
    })
    res.status(201).json(user)
})

//porta para buscar um usuario pelo id
app.get("/user/:id", async(req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where:{id}})
    

    if(!user){
        return res.status(404).json({error:"Usuário nao encontrado"})
    }
    res.json(user)
})

//porta para deletar pelo id
app.delete("/user/:id", async(req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({where:{id}})

    if(!user){
        return res.status(404).json({error:"Usuário nao encontrado"})
    }
    await prisma.user.delete({
        where: {id}
    })
    res.status(204).send()
})

//Porta para atualizar pelo id
app.put("/user/:id", async(req, res) =>{
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({
        where:{id}
    })

    if(!user){
        return res.status(404).json({erro: "Usuario not encontrado"})
    }

    const{name, email} = req.body
    
    const updatedUser = await prisma.user.update({
        where: {id},
        data:{
            name,
            email
        }
    })

    res.json(updatedUser)
})

app.listen(3000, () => {
    console.log("Server is runnig on port 3000")
})