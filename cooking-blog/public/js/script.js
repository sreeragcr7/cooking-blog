
const addIngredientsBtn =  document.getElementById('addIngredientsBtn');
const ingredientList = document.querySelector('.ingredientList');
const ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];

addIngredientsBtn.addEventListener('click', () => {

    let newIngredient = ingredientDiv.cloneNode(true);
    let input = newIngredient.getElementsByTagName('input')[0];
    input.value = ''; //reseting Value
    ingredientList.appendChild(newIngredient);
})