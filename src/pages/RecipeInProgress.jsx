import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import shareSvg from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { getMealDetails, getDrinkDetails } from '../services/apiServices';
import IngredientCheckbox from '../components/IngredientCheckbox';
import { handleClickFavorite } from '../helpers/handleClickFavorite';
import '../styles/recipeDetailsAndInProgress.css';

const copy = require('clipboard-copy');

function RecipeInProgress({ match: { params: { id } }, location, history }) {
  // Declaração de estados e variáveis
  const { pathname } = location;
  const [data, setData] = useState({});
  const [ingredientsEntries, setIngredientsEntries] = useState([]);
  const [measureEntries, setMeasureEntries] = useState([]);
  const [ingredientsUsed, setIngredientsUsed] = useState([]);
  const [typeOfRecipe, setTypeOfRecipe] = useState('');
  const [deleteItem, setDeleteItem] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const {
    idMeal = '',
    idDrink = '',
    strArea = '',
    strMealThumb = '',
    strAlcoholic = '',
    strDrinkThumb = '',
    strMeal = '',
    strDrink = '',
    strCategory = '',
    strInstructions = '',
    strTags = '',
  } = data;
  // Recupera os favoritos salvos no localStorage
  useEffect(() => {
    const haveFavorites = localStorage.getItem('favoriteRecipes') ? JSON.parse(
      localStorage.getItem('favoriteRecipes'),
    ).some(
      (favoriteRecipe) => favoriteRecipe.id === id,
    ) : false;
    if (haveFavorites) {
      setIsFavorited(true);
    }
  }, [id]);
  // Buscando os ingredientes, medidas e tipo de receitas ('meal' ou 'drink'). Salva nos estados
  useEffect(() => {
    if (pathname.includes('meals')) {
      getMealDetails(id).then((response) => setData(response));
      setTypeOfRecipe('meals');
    } else {
      getDrinkDetails(id).then((response) => setData(response));
      setTypeOfRecipe('drinks');
    }
    const ingredients = Object.entries(data).filter(
      (entrie) => entrie[0].includes('strIngredient') && entrie[1],
    );
    setIngredientsEntries(ingredients);
    const measures = Object.entries(data).filter(
      (entrie) => entrie[0].includes('strMeasure') && entrie[1],
    );
    setMeasureEntries(measures);
  }, [data, id, pathname]);
  // Lida com a variável 'inProgressRecipes' no localStorage
  useEffect(() => {
    const inProgressStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    const idAndIngredientsUsed = { [id]: [] };
    const initialObject = {
      drinks: typeOfRecipe === 'drinks' ? idAndIngredientsUsed : {},
      meals: typeOfRecipe === 'meals' ? idAndIngredientsUsed : {},
    };
    // Se não hover nada salvo no localStorage, cria-se o localStorage com o initialObject e seta o estado
    if (typeOfRecipe !== '' && !inProgressStorage) {
      localStorage.setItem('inProgressRecipes', JSON.stringify(initialObject));
      setIngredientsUsed(initialObject[typeOfRecipe][id]);
    // Caso haja algo, mas não tenha nada referente ao ID atual, adiciona-se o array vazio [] pata o ID atual
    } else if (
      typeOfRecipe !== '' && !Object.keys(inProgressStorage[typeOfRecipe])
        ?.some((item) => item === id)
    ) {
      inProgressStorage[typeOfRecipe][id] = [];
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressStorage));
      setIngredientsUsed(inProgressStorage[typeOfRecipe][id]);
    // Caso haja algo e tenha algo referente ao ID atual seta o estado
    } else if (
      typeOfRecipe !== '' && Object.keys(inProgressStorage[typeOfRecipe])
        ?.some((item) => item === id)
    ) {
      setIngredientsUsed(inProgressStorage[typeOfRecipe][id]);
    }
  }, [id, typeOfRecipe]);
  // Resgata o que tem salvo no localStorage de ingredientes salvos e deleta o id do localStorage se não houver nenhum ingrediente marcado
  useEffect(() => {
    const inProgressStorage = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (typeOfRecipe !== '' && ingredientsUsed.length !== 0) {
      inProgressStorage[typeOfRecipe][id] = ingredientsUsed;
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressStorage));
    }
    if (typeOfRecipe !== '' && deleteItem) {
      delete inProgressStorage[typeOfRecipe][id];
      localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressStorage));
      setDeleteItem(false);
    }
  }, [id, typeOfRecipe, ingredientsUsed, deleteItem]);
  // Varável que salva o resultado da pergunta: 'Todas os ingredientes da receita foram marcados?'
  const usedIngredientsValidation = ingredientsEntries.length === ingredientsUsed.length;
  // Lida com o clique do botão "Finish Recipe"
  const handleFinishButton = () => {
    const doneDate = new Date();
    const objectToSetDoneRecipes = {
      id: idMeal || idDrink,
      type: idMeal ? 'meal' : 'drink',
      nationality: strArea || '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic || '',
      name: strMeal || strDrink,
      image: strDrinkThumb || strMealThumb,
      doneDate: doneDate.toISOString(),
      tags: strTags ? strTags.split(',') : [],
    };
    const doneRecipes = localStorage.getItem('doneRecipes')
      ? JSON.parse(localStorage.getItem('doneRecipes')) : null;
    if (!doneRecipes) {
      localStorage.setItem('doneRecipes', JSON.stringify([objectToSetDoneRecipes]));
    } else {
      localStorage.setItem(
        'doneRecipes',
        JSON.stringify([...doneRecipes, objectToSetDoneRecipes]),
      );
    }
    // depois de terminar a receita ela remove a receita do inProgress
    const inProgressWithoutCurr = JSON.parse(localStorage.getItem('inProgressRecipes'));
    delete inProgressWithoutCurr.meals[id];
    delete inProgressWithoutCurr.drinks[id];
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressWithoutCurr));
    history.push('/done-recipes');
  };

  function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const matchReg = url.match(regExp);

    return matchReg[2];
  }

  return (
    <div>
      <img
        data-testid="recipe-photo"
        src={ strMealThumb || strDrinkThumb }
        alt={ `${strMeal || strDrink}` }
        className="recipe-photo"
      />
      <div>
        <button
          className="share-btn"
          data-testid="share-btn"
          onClick={ () => {
            copy(`http://localhost:3000${pathname.replace('/in-progress', '')}`);
            setIsLinkCopied(true);
          } }
        >
          <img src={ shareSvg } alt="share-icon" />
        </button>
        {isLinkCopied && <p className="link-copied">Link copied!</p>}
        <button
          type="button"
          className="favorite-btn"
          onClick={ () => handleClickFavorite(data, id, isFavorited, setIsFavorited) }
        >
          <img
            src={ isFavorited
              ? blackHeartIcon
              : whiteHeartIcon }
            alt="favorite-icon"
            data-testid="favorite-btn"
          />
        </button>
      </div>
      <h3 data-testid="recipe-title" className="recipe-title">{ strMeal || strDrink }</h3>
      <p data-testid="recipe-category" className="recipe-category">
        {strCategory}
      </p>
      <div className="container-recipe-details">
        <h2>Ingredients</h2>
        <ul className="ingredients-container">
          {ingredientsEntries.map((ingredientEntrie, index) => (
            <IngredientCheckbox
              key={ `ingredient-${index}` }
              ingredientEntrie={ ingredientEntrie }
              measureEntries={ measureEntries }
              index={ index }
              recipeId={ id }
              ingredientsUsed={ ingredientsUsed }
              setIngredientsUsed={ setIngredientsUsed }
              isChecked={
                ingredientsUsed.some((item) => item === `${
                  ingredientEntrie[1]} ${measureEntries[index]
                  ? measureEntries[index][1] : ''}`)
              }
              setDeleteItem={ setDeleteItem }
            />
          ))}
        </ul>
        <h2>Instructions</h2>
        <p data-testid="instructions" className="instructions">{strInstructions}</p>
        <h2>Video</h2>
        {data.strYoutube && <iframe
          width="853"
          height="480"
          src={ `https://www.youtube.com/embed/${getId(data.strYoutube)}` }
          title="Embedded youtube"
          data-testid="video"
          className="recipe-video"
        />}
        <div className="button-container">
          <button
            type="button"
            className="finish-recipe-btn"
            data-testid="finish-recipe-btn"
            onClick={ handleFinishButton }
            disabled={ !usedIngredientsValidation }
          >
            Finish Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

RecipeInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default RecipeInProgress;
