import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useMemo } from 'react';
import Cookies from 'universal-cookie';
import { sanitizeHTML } from 'src/utils';
import styles from 'src/styles/recipe.module.css';
interface RecipeParams {
  id: string;
  [key: string]: string | undefined;
}
export interface Recipe {
  aggregateLikes: number;

  cheap: boolean;
  cookingMinutes: number;
  creditsText: string;
  dairyFree: boolean;
  gaps: string;
  glutenFree: boolean;
  healthScore: number;
  id: number;
  image: string;
  imageType: string;
  instructions: string;
  lowFodmap: boolean;
  originalId: null;
  preparationMinutes: number;
  pricePerServing: number;
  readyInMinutes: number;
  servings: number;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  sustainable: boolean;
  title: string;
  vegan: boolean;
  vegetarian: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  weightWatcherSmartPoints: number;
}
interface ExtendedIngredient {
  measures: {
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
  name: string;
}
export default function Recipe() {
  const { id } = useParams<RecipeParams>();
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  const [ingredients, setIngredients] = useState<ExtendedIngredient[]>([]);
  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/recipes/id/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        setRecipe(res.data.data);
        setIngredients(res.data.data.extendedIngredients);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, cookies]);

  return (
    <div className={styles['recipe-container']}>
      {recipe && (
        <div className={styles['recipe-details']}>
          <h1 className={styles['recipe-title']}>{recipe.title}</h1>
          <div className={styles['center-content']}>
            <div className={styles['recipe-image-container']}>
              <img
                className={styles['recipe-image']}
                src={recipe.image}
                alt={recipe.title}
              />
            </div>
            <div className={styles['recipe-info']}>
              <p>Ready in: {recipe.readyInMinutes} minutes</p>
              <p>Number of servings: {recipe.servings}</p>
              <p>Vegetarian: {recipe.vegetarian ? 'Yes' : 'No'}</p>
              <p>Vegan: {recipe.vegan ? 'Yes' : 'No'}</p>
              <p>Dairy free: {recipe.dairyFree ? 'Yes' : 'No'}</p>
              <p>Gluten free: {recipe.glutenFree ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className={styles['ingredients']}>
            <h2>Ingredients</h2>
            <ul className={styles['ingredients-list']}>
              {ingredients.map((ingredient) => (
                <li key={ingredient.name}>
                  {ingredient.measures.metric.amount}{' '}
                  {ingredient.measures.metric.unitShort} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles['instructions']}>
            <h2>Instructions</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(recipe.instructions || ''),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
