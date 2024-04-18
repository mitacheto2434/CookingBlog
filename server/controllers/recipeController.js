 require('../models/database');
 const Category = require('../models/Category');
 const Recipe = require('../models/recipe');
 const bcrypt = require('bcryptjs');
const User = require('../models/user');
 
 
 /**
  * GET/
  *Homepage.
  */
 

  exports.homepage=async(req,res)=>{

    try{

      const limitnumber=5;
      const categories=await Category.find({}).limit(limitnumber);
      const latest=await Recipe.find({}).sort({_id:-1}).limit(limitnumber);
      const thai = await Recipe.find({category:'Thai'}).limit(limitnumber);
      const american = await Recipe.find({category:'American'}).limit(limitnumber);
      const chinese = await Recipe.find({category:'Chinese'}).limit(limitnumber);

      const food = { latest,thai,american,chinese };

      res.render('index', { title: 'Flavorscript' ,categories,food});
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }




  }
  /**
   * GET/
   *Explore categories.
   */

   exports.explorecategories=async(req,res)=>{

    try{

      const limitnumber=20;
      const categories=await Category.find({}).limit(limitnumber);

      res.render('categories', { title: 'Flavorscript-Categories' ,categories});
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }
  }


  exports.explorecategoriesById=async(req,res)=>{

    try{
      let categoryId=req.params.id;
      const limitnumber=20;
      const categoryById=await Recipe.find({'category':categoryId}).limit(limitnumber);

      res.render('categories', { title: 'Flavorscript-Categories' ,categoryById});
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }
  }
  
  /**
   * GET/
   *recipes with ids and all.
   */

   exports.exploreRecipe=async(req,res)=>{

    try{
      let recipeId=req.params.id;

      const recipe= await Recipe.findById(recipeId);
      
      

      res.render('recipe', { title: 'Flavorscript-Recipe',recipe });
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }
  }


  /**
   * POST
   *search
   */
    exports.searchRecipe=async(req,res)=>{


    try {
      let searchTerm=req.body.searchTerm;
      let recipe= await Recipe.find({$text:{$search:searchTerm}});
      res.render('search', { title: 'Flavorscript-Search',recipe });
    } catch (error) {
      
    }
  
      
    
  }
  


  exports.exploreLatest=async(req,res)=>{

    try{
      const limitnumber=20;
      const recipe=await Recipe.find({}).sort({_id:-1}).limit(limitnumber);

      res.render('explore-latest', { title: 'Flavorscript-Explore',recipe });
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }
  }

  exports.exploreRandom=async(req,res)=>{

    try{
      let count=await Recipe.find().countDocuments();
      let random=Math.floor(Math.random()*count);
      let recipe=await Recipe.findOne().skip(random).exec();

      res.render('explore-random', { title: 'Flavorscript-Explore',recipe });
    }catch(err){

      res.status(500).send({message:err.message||"Some error occurred while retrieving categories."})
    }
  }




  exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }

  /**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/upload/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}

exports.registerForm = (req, res) => {
  res.render('register'); // render the registration form
};

exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
      username: req.body.username,
      password: hashedPassword
  });
  await user.save();
  res.redirect('/login');
};

exports.loginForm = (req, res) => {
  res.render('login'); // render the login form
};

exports.login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user;
      req.session.justLoggedIn = true;
      res.redirect('/');
  } else {
      res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/');
      }
      res.clearCookie('sid');
      res.redirect('/login');
  });
};

exports.about = (req, res) => {
  res.render('about', { title: 'About' });
};


// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();








  


