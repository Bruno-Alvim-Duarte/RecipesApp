import React, { useState } from 'react';
import PropTypes from 'prop-types';
import shareIcon from '../images/shareIcon.svg';
import '../styles/doneRecipes.css';

function DoneRecipeCard({ recipe, index, history }) {
  const [didCopy, setDidCopy] = useState(false);
  const {
    id,
    image,
    name,
    category,
    doneDate,
    tags,
    type,
    alcoholicOrNot,
    nationality,
  } = recipe;

  return (
    <div
      className="done-recipe-card"
      data-testid={ `${index}-recipe-card` }
    >
      <button
        data-testid={ `${index}-image-button` }
        onClick={ () => history.push(`/${type}s/${id}`) }
      >
        <img
          src={ image }
          alt={ `imagem da receita ${name}` }
          data-testid={ `${index}-horizontal-image` }
          className="recipe-image"
        />
      </button>
      <div className="recipe-card-right">
        <button
          onClick={ () => history.push(`/${type}s/${id}`) }
        >
          <span
            data-testid={ `${index}-horizontal-name` }
            className="recipe-name"
          >
            { name }
          </span>
        </button>
        <span
          data-testid={ `${index}-horizontal-top-text` }
          className="category-name"
        >
          { type === 'meal' ? `${nationality} - ${category}` : alcoholicOrNot }
        </span>
        <span
          data-testid={ `${index}-horizontal-done-date` }
          className="category-name"
        >
          { `${doneDate}` }
        </span>

        <div style={ { display: 'flex', flexDirection: 'row' } }>
          <span
            data-testid={ `${index}-${[tags[0]]}-horizontal-tag` }
            className="tag-name"
          >
            { tags[0] }
          </span>
          <span
            data-testid={ `${index}-${tags[1]}-horizontal-tag` }
            className="tag-name"
          >
            { tags[1] }
          </span>
        </div>
        <button
          onClick={ () => {
            navigator.clipboard.writeText(
              `${window.location.origin}/${type}s/${id}`,
            );
            setDidCopy(true);
          } }
        >
          { didCopy ? (<p>Link copied!</p>)
            : (
              <img
                src={ shareIcon }
                alt="share-icon"
                data-testid={ `${index}-horizontal-share-btn` }
              />)}
        </button>

      </div>
    </div>
  );
}

DoneRecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    doneDate: PropTypes.string,
    type: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    nationality: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  index: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default DoneRecipeCard;
