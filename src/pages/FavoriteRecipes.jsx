import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import shareSvg from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import '../styles/favoriteRecipes.css';
import '../styles/doneRecipes.css';

const copy = require('clipboard-copy');

function FavoriteRecipes(props) {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  useEffect(() => {
    const recipesFunc = () => {
      const doneRecipes = localStorage.getItem('favoriteRecipes')
        ? JSON.parse(localStorage.getItem('favoriteRecipes')) : [];
      return doneRecipes;
    };
    setRecipes(recipesFunc);
  }, []); //

  const filteredRecipes = recipes.filter((recipe) => {
    if (filter === 'all') {
      return true;
    } if (filter === 'meal') {
      return recipe.type === 'meal';
    }
    return recipe.type === 'drink';
  });

  return (
    <div
      style={ {
        width: '100%',
        padding: '0',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' } }
    >
      <Header
        headerType={ { title: 'Favorite Recipes', profileIcon: true, searchIcon: false } }
        { ...props }
      />
      <div className="filters-container">
        <button
          data-testid="filter-by-meal-btn"
          type="button"
          onClick={ () => setFilter('meal') }
          className="tag-name"
        >
          Meals

        </button>
        <button
          data-testid="filter-by-drink-btn"
          type="button"
          onClick={ () => setFilter('drink') }
          className="tag-name"
        >
          Drinks

        </button>
        <button
          data-testid="filter-by-all-btn"
          type="button"
          onClick={ () => setFilter('all') }
          className="tag-name"
        >
          All
        </button>
      </div>
      <div className="container-favorite-recipes">
        { filteredRecipes.map((recipe, index) => (
          <div key={ recipe.id } className="favorite-recipes-card">
            <Link
              to={ recipe.type === 'meal'
                ? `/meals/${recipe.id}` : `/drinks/${recipe.id}` }
              className="recipe-image"
            >
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt=""
                className="favorite-recipe-img"
              />
            </Link>
            <div className="favorite-card-right">
              <div className="favorite-card-title">
                <Link
                  to={ recipe.type === 'meal'
                    ? `/meals/${recipe.id}` : `/drinks/${recipe.id}` }
                >
                  <h2 data-testid={ `${index}-horizontal-name` }>{ recipe.name }</h2>
                </Link>
                { recipe.alcoholicOrNot ? (
                  <p data-testid={ `${index}-horizontal-top-text` }>
                    { recipe.alcoholicOrNot }
                    {' '}
                    -
                    {' '}
                    { recipe.category}
                  </p>
                ) : (
                  <p data-testid={ `${index}-horizontal-top-text` }>
                    { recipe.nationality }
                    {' '}
                    -
                    {' '}
                    { recipe.category }
                  </p>
                )}
              </div>
              <div className="favorite-card-buttons">
                <button
                  onClick={ () => {
                  // handleClickFavorite();
                    const localStorageRecipe = JSON.parse(localStorage
                      .getItem('favoriteRecipes'))
                      .filter((favRecipe) => favRecipe.id !== recipe.id);
                    localStorage.setItem(
                      'favoriteRecipes',
                      JSON.stringify(localStorageRecipe),
                    );
                    setRecipes(localStorageRecipe);
                  } }
                >
                  <img
                    src={ blackHeartIcon }
                    alt="favorite-icon"
                    data-testid={ `${index}-horizontal-favorite-btn` }
                  />
                </button>
                <button
                  onClick={ () => {
                    copy(`http://localhost:3000/meals/${recipe.id}`);
                    setIsLinkCopied(true);
                  } }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareSvg }
                    alt="share-icon"
                  />
                </button>
              </div>
              {isLinkCopied && <p>Link copied!</p>}
            </div>
          </div>
        ))}
      </div>
      <Footer { ...props } />
    </div>
  );
}

export default FavoriteRecipes;
