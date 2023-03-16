import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import renderWithRouter from './helpers/renderWithRouter';
import HeaderProvider from '../context/HeaderProvider';
import RecipesProvider from '../context/RecipesProvider';
import App from '../App';

describe('testa o componente DoneRecipeCard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const doneRecipes = [{
    id: '53060',
    type: 'meal',
    nationality: 'Croatian',
    category: 'Side',
    alcoholicOrNot: '',
    name: 'Burek',
    image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    tags: ['StreetFood', 'Onthego'],
    doneDate: '2023-03-16T13:19:25.599Z',
  },
  {
    id: '53065',
    type: 'meal',
    nationality: 'Japanese',
    category: 'Seafood',
    alcoholicOrNot: '',
    name: 'Sushi',
    image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
    tags: [],
    doneDate: '2023-03-16T13:19:44.527Z',
  }];
  const doneRecipesPath = '/done-recipes';

  it('deveria redirecionar pra tela de detalhes quando você clicka na imagem de um item favorito', async () => {
    const { history } = renderWithRouter(
      <RecipesProvider>
        <HeaderProvider>
          <App />
        </HeaderProvider>
      </RecipesProvider>,
    );

    act(() => {
      window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
      history.push(doneRecipesPath);
    });

    userEvent.click(await screen.findByTestId('0-horizontal-image'));
    expect(history.location.pathname).toBe('/meals/53060');
  });
  it('deveria redirecionar pra tela de detalhes quando você clicka no nome de um item favorito', async () => {
    const { history } = renderWithRouter(
      <RecipesProvider>
        <HeaderProvider>
          <App />
        </HeaderProvider>
      </RecipesProvider>,
    );

    act(() => {
      window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
      history.push(doneRecipesPath);
    });

    userEvent.click(await screen.findByTestId('0-horizontal-name'));
    expect(history.location.pathname).toBe('/meals/53060');
  });
  it('deveria copiar o link de um item quando clicka no botão de copiar', async () => {
    const mockedWriteText = jest.fn();

    navigator.clipboard = {
      writeText: mockedWriteText,
    };
    const { history } = renderWithRouter(
      <RecipesProvider>
        <HeaderProvider>
          <App />
        </HeaderProvider>
      </RecipesProvider>,
    );

    act(() => {
      window.localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
      history.push(doneRecipesPath);
    });

    const copyBtn = await screen.findByTestId('0-horizontal-share-btn');
    userEvent.click(copyBtn);
    expect(mockedWriteText).toHaveBeenCalledWith('http://localhost/meals/53060');
  });
});
