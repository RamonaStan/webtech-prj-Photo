var express=require("express");
var bodyParser=require("body-parser");
var cors=require("cors");

var app=express();
app.use(bodyParser.json());
app.use(cors());

var nodeadmin=require("nodeadmin");
app.use(nodeadmin(app));

var Sequelize=require("sequelize");

//sequelize connexion
var sequelize=new Sequelize('projectDB','ramonastan','',{
    dialect:'mysql',
    host:'127.0.0.1',
    port:'3306'
});

var Event=sequelize.define('events',{
    name:{
        type: Sequelize.STRING,
        field: 'name'
    },
    date:{
        type: Sequelize.STRING,
        field: 'date'
    },
    
    nrPhoto:{
        type: Sequelize.STRING,
        field: 'nrPhoto'
    },
    //id_location: {
      //  type: Sequelize.INTEGER,
        //field: 'id_location'
    //}
},
{
    timestamps: false
});

//CRUD operations
//create
app.post('/events',function(req,res){
    Event.create(req.body).then(function(event){
        Event.findById(event.id).then(function(event){
            res.status(201).send(event);
        });
    });
});

//read all
app.get('/events',function(req,res){
    Event.findAll().then(function(events){
        res.status(200).send(events);
    });
});

//read one by id
app.get('/events/:id',function(req,res){
    Event.findById(req.params.id).then(function(event){
        if(event){
            res.status(200).send(event);
        } else {
            res.status(404).send();
        }
    });
});

//update
app.put('/events/:id',function(req,res){
    Event.findById(req.params.id).then(function(event){
        if(event){
            event.updateAttributes(req.body).then(function(){
                res.status(200).send('updated');
            }).catch(function(error){
                console.warn(error);
                res.status(500).send('server error');
            });
        } else {
            res.status(404).send();
        }
    });
});

//delete
app.delete('/events/:id',function(req,res){
    Event.findById(req.params.id).then(function(event){
        if(event){
            event.destroy().then(function(){
                res.status(204).send();
            }).catch(function(error){
                console.warn(error);
                res.status(500).send('server error');
            });
        } else {
            res.status(404).send();
        }
    });
});

app.use('/admin',express.static('admin'));

app.listen(process.env.PORT);