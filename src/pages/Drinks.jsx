import React, { useContext } from 'react';
import RecipesContext from '../context/RecipesContext';
import Header from '../components/Header';
import Recipes from '../components/Recipes';
import Footer from '../components/Footer';
import CategoryButton from '../components/CategoryButton';
import allDrinks from '../images/allDrinks.svg';
import '../styles/recipesFirstPage.css';

function Drinks(props) {
  const { drinks, drinksCategories, setApiURLDrinks } = useContext(RecipesContext);
  const numberOfCategoriesToShow = 5;
  return (
    <div className="drinks-page">
      <Header
        headerType={ { title: 'Drinks', profileIcon: true, searchIcon: true } }
        { ...props }
      />
      <div className="categories-buttons-container">
        <div className="category-button-container">
          <button
            data-testid="All-category-filter"
            onClick={ () => setApiURLDrinks('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=') }
            className="category-button"
          >
            <img
              src={ allDrinks }
              alt="icone de Drinks"
              className="category-icon"
            />
          </button>
          <p className="category-name">All</p>
        </div>
        {drinksCategories.slice(0, numberOfCategoriesToShow).map(({ strCategory }) => (
          <CategoryButton
            key={ strCategory }
            strCategory={ strCategory }
            drinkOrMeal="drink"
          />
        ))}
      </div>
      <Recipes recipes={ drinks } { ...props } />
      <Footer { ...props } />
    </div>
  );
}

export default Drinks;
