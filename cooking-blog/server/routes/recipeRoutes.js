
const express = require('express');
const router = express.Router();
const {getRecipe, exploreCategories, exploreRecipe, 
      exploreCategoriesById, searchRecipe, 
      exploreLatest, exploreRandom, submitRecipe, postSubmitRecipe, updateRecipe} = require('../controllers/recipeController')

router.route('/')
      .get(getRecipe);
      

router.route('/categories')
      .get(exploreCategories);  


router.route('/recipe/:id')      
      .get(exploreRecipe);


router.route('/categories/:id')      
      .get(exploreCategoriesById);


router.route('/search')
      .post(searchRecipe);

      
router.route('/explore-latest')
      .get(exploreLatest);     
      
      
router.route('/explore-random') 
      .get(exploreRandom); 
      

router.route('/submit-recipe')
      .get(submitRecipe)  
      .post(postSubmitRecipe);
      

router.route('/submit-recipe/:id')      
      .put(updateRecipe)


module.exports = router;