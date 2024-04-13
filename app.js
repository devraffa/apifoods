const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const Food = require("./Model/food");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res)=>{
    res.send("teste teset");
});

app.get("/api/foods", async (req, res) => {
    try {
        const food = await Food.find({});
        res.json(food);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


app.get("/api/foods/:id", async(req, res)=>{
    try{
        const pegafood = await Food.findById(req.params.id)
        if (pegafood == null) {
            return res.status(404).json({ message: "A Comida não foi encontrada" });
        }
        res.json(pegafood);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


app.post("/api/foods", async(req, res) =>{

    try {
        const food = new Food({
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            expirationDate: req.body.expirationDate,
            price: req.body.price
        });
        const novaComida = await food.save();
        res.status(201).json(novaComida);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

app.put("/api/foods/:id", async (req, res) => {
    try {
        const upFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (upFood == null) {
            return res.status(404).json({ message: "Comida não encontrada" });
        }
        res.json(upFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete("/api/foods/:id", async(req, res) =>{

    try{
        const forafood = await Food.findByIdAndDelete(req.params.id);
        if( forafood == null){
            return res.status(404).json({ message: "Comida não encontrada" });
        }
        res.json(forafood);
        console.log("Comida deletada com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
    

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log('Conectou no banco de dados');

        app.listen(3002, () => {
            console.log("Servidor rodando");
        });
    })
    .catch((err) => {
        console.log(err);
    });
