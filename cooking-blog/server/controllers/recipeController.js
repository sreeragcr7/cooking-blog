require('../models/mongodb');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');



/*
GET
Home-Page
*/
const getRecipe = async(req, res) => {
    
    try {

        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);

        const latestRecipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category' : 'Thai'}).limit(limitNumber);
        const indian = await Recipe.find({ 'category' : 'Indian'}).limit(limitNumber);
        const chinese = await Recipe.find({ 'category' : 'Chinese'}).limit(limitNumber);
        const american = await Recipe.find({ 'category' : 'American'}).limit(limitNumber);
   
        const food = {latestRecipe, thai, indian, american, chinese};


        res.render('index', {title:"Home-Page", categories, food} );
        
    } catch (error) {
        res.status(404).json({message: error.message || 'Error Occured!'}); 
    }
}


/*
GET
Categories-Page
*/
const exploreCategories = async(req,res) => {
    
    try{
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);
    res.render('categories', {title:'Categories-Page', categories} );
    }
    catch(error){
        res.status(500).json({message: error.message || 'Categories not found.'});
    }
}

/*
GET /:id
RecipeDetails-Page
*/

const exploreRecipe = async (req,res) => {

    try{
        const recipe = await Recipe.findById(req.params.id)
        res.render('recipe', { title: 'Recipe-Page', recipe })

    }catch(error){
        res.status(500).json({ message: error.message || 'Recipe not found.'})
    }
}

/*
GET /:name
Category-Page by 
*/

const exploreCategoriesById = async (req,res) => {

    try{

        const limitNumber = 20;
        
        const categoryById = await Recipe.find({ 'category' : req.params.id }).limit(limitNumber);
        res.render('categories', { title: 'Categories-Page by Name', categoryById})

    }catch(error){
        res.status(500).json({ message: error.message || 'Category not found.'})
    }
}

/*
POST 
Search-Page  
*/

const searchRecipe = async (req,res) => {

    try{

        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Search-Page', recipe});

    }catch(error){
        res.status(500).json({ message: error.message || 'Error Occured'})
    }
}


/*
GET
Explore-latest 
*/

const exploreLatest = async (req,res) => {

    try{

        const limitNumber = 20;
        const recipe = await Recipe.find().sort({_id: -1}).limit(limitNumber);
        res.render('explore-latest', {title : 'Explore-Latest-Page', recipe})

    }catch(error){
        res.status(500).json({ message: error.message || 'Error Occured'})

    }

}


/*
GET
Explore-Random
*/

const exploreRandom = async(req,res) => {

    try {
        let count = await Recipe.countDocuments();
        let randomIndexes = [];
        let numRecipes = 5; // Number of random recipes you want to display

        // Generate unique random indexes
        while (randomIndexes.length < numRecipes && randomIndexes.length < count) {
            let random = Math.floor(Math.random() * count);
            if (!randomIndexes.includes(random)) {
                randomIndexes.push(random);
            }
        }

        // Fetch recipes based on random indexes
        const recipes = await Promise.all(randomIndexes.map(async (index) => {
            return await Recipe.findOne().skip(index).exec();
        }));

        res.render('explore-random', { title: 'Explore Random Recipes', recipes });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error Occurred' });
    }
}


/*
GET
Submit-Recipe
*/

const submitRecipe = async (req,res) => {

        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');

        res.render('submit-recipe', {title: 'Submit-Recipe-page', infoErrorsObj, infoSubmitObj});

}


/*
POST
Submit-Recipe
*/

const postSubmitRecipe = async(req,res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if( !req.files || Object.keys(req.files).length === 0){
            console.log('No File Found'); 
        }else{

            imageUploadFile = req.files.image
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, (err) => {
                
                if(err) return res.status(500).send(err)
            })
        }


        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients:req.body.ingredients,
            category: req.body.category,
            image: newImageName
        })

        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been Added.')
        res.redirect('/submit-recipe');
        
    } catch (error) {
        req.flash('infoErrors' , error.message || "Something went wrong.") 
       res.redirect('/submit-recipe'); 
    }

}

/*
PUT /update recipe
Submit-Recipe
*/

const updateRecipe = async (req, res) => {

    try{

    const recipe = await Recipe.findById(req.params.id);
       if(!recipe){
        res.status(404);
        throw new Error('Recipe not found!')
       }

       const Updatedrecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
       )
    req.flash('infoSubmit', 'Recipe has been Added.')
    res.redirect('/submit-recipe');

    }catch(error){
        req.flash('infoErrors' , error.message || "Something went wrong.") 
       res.redirect('/submit-recipe');
    }
}

module.exports = { getRecipe, exploreCategories, exploreRecipe, 
    exploreCategoriesById, searchRecipe,  
    exploreLatest, exploreRandom, submitRecipe, postSubmitRecipe, updateRecipe };  



