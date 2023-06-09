const MEALS_CATEGORIES_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
const DRINKS_CATEGORIES_URL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
const MEAL_DETAIL_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';
const DRINK_DETAIL_URL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

const defaultNumberOfResponses = 12;

const getMeals = async (apiURL, numberOfResponses = defaultNumberOfResponses) => {
  const response = await fetch(apiURL);
  const data = await response.json();
  const result = data.meals?.slice(0, numberOfResponses) || [];
  return result;
};

const getDrinks = async (apiURL, numberOfResponses) => {
  const response = await fetch(apiURL);
  const data = await response.json();
  const result = data.drinks?.slice(0, numberOfResponses) || [];
  return result;
};

const getMealsCategories = async () => {
  const response = await fetch(MEALS_CATEGORIES_URL);
  const data = await response.json();
  return data.meals;
};

const getDrinksCategories = async () => {
  const response = await fetch(DRINKS_CATEGORIES_URL);
  const data = await response.json();
  return data.drinks;
};

const getMealDetails = async (id) => {
  const response = await fetch(`${MEAL_DETAIL_URL}${id}`);
  const data = await response.json();
  return data.meals[0];
};

const getDrinkDetails = async (id) => {
  const response = await fetch(`${DRINK_DETAIL_URL}${id}`);
  const data = await response.json();
  return data.drinks[0];
};

export {
  getMeals,
  getDrinks,
  getMealsCategories,
  getDrinksCategories,
  getMealDetails,
  getDrinkDetails };
