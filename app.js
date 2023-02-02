const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

// const Users = require('./models/Users');
// var cors = require('cors');
// const axios = require('axios');

// app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.post('/user/add-user', async (req, res, next)=> { 
//     try{  
//        if(!req.body.phone){
//           throw new Error('Phone number is mandatory');
//        }
//     const name = req.body.name;
//     const email = req.body.email;
//     const phonenumber = req.body.phone;
    
//     const data = await Users.create( {username: name, email: email, phonenumber: phonenumber})
//     res.status(201).json({newUserDetails: data});
//     } catch(err){
//        res.status(500).json({
//           error: err
//        })
//     } 
//  })
  
//  app.get('/user/get-users', async (req, res, next) => {
//    try{
//     const users = await User.findAll();
//     res.status(200).json({allUsers: users})
//    } catch(error){
//     console.log('Get user is failing', JSON.stringify(error));
//     res.status(500).json({error: err})
//    }
//  })
 
//  app.delete('user/delete-user/:id', async (req, res) => {
//     const uId = req.params.id;
//     try{
//     if(req.params.id == 'undefined'){
//        console.log('ID is missing');
//       return res.status(400).json({err: 'ID is missing'})
//     }
//     await User.destroy({where: {id: uId}});
//     res.sendStatus(200);
//     } catch(err){
//        console.log(err);
//        res.status(500).json(err)
//     }
//  })

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

sequelize
// .sync({ force: true})
.sync()
.then(result => {
    return User.findByPk(1);
    //console.log(result);
}).then( user => {
    if(!user){
        return User.create({ name: 'Max', email: 'test@test.com'});
    }
    return user;
})
.then(user => {
    console.log(user);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
