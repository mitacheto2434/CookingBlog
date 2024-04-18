const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');


/**
 * app routes
 */
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.explorecategories);
router.get('/categories/:id', recipeController.explorecategoriesById);
router.get('/recipe/:id',recipeController.exploreRecipe);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest',recipeController.exploreLatest);
router.get('/explore-random',recipeController.exploreRandom);
router.get('/submit-recipe',recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/about', recipeController.about);
router.get('/register', recipeController.registerForm);
router.post('/register', recipeController.register);
router.get('/login', recipeController.loginForm);
router.post('/login', recipeController.login);
router.get('/logout', recipeController.logout);
module.exports = router;