import styles from '../styles/search.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
}
export default function Search() {
  const [advanced, setAdvanced] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');
  const [intolerances, setIntolerances] = useState('');
  const [includeIngredients, setIncludeIngredients] = useState('');
  const [excludeIngredients, setExcludeIngredients] = useState('');
  const [type_, setType_] = useState('');
  const [maxReadyTime, setMaxReadyTime] = useState(0);
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(0);
  const [minProtein, setMinProtein] = useState(0);
  const [maxProtein, setMaxProtein] = useState(0);
  const [minFat, setMinFat] = useState(0);
  const [maxFat, setMaxFat] = useState(0);
  const [minCarbs, setMinCarbs] = useState(0);
  const [maxCarbs, setMaxCarbs] = useState(0);
  const [minSugar, setMinSugar] = useState(0);
  const [maxSugar, setMaxSugar] = useState(0);
  const showAdvanced = () => {
    setAdvanced(!advanced);
  };
  useEffect(() => {
    if (search !== '') {
      const params = {
        search,
        cuisine: cuisine || undefined,
        diet: diet || undefined,
        intolerances: intolerances || undefined,
        includeIngredients: includeIngredients || undefined,
        excludeIngredients: excludeIngredients || undefined,
        type_: type_ || undefined,
        maxReadyTime: maxReadyTime || undefined,
        minCalories: minCalories || undefined,
        maxCalories: maxCalories || undefined,
        minProtein: minProtein || undefined,
        maxProtein: maxProtein || undefined,
        minFat: minFat || undefined,
        maxFat: maxFat || undefined,
        minCarbs: minCarbs || undefined,
        maxCarbs: maxCarbs || undefined,
        minSugar: minSugar || undefined,
        maxSugar: maxSugar || undefined,
      };

      axios
        .get('http://localhost:8000/recipes/multiple', {
          params,
        })
        .then((res) => {
          console.log(res.data.data.results);
          setResults(res.data.data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [
    search,
    cuisine,
    diet,
    intolerances,
    includeIngredients,
    excludeIngredients,
    type_,
    maxReadyTime,
    minCalories,
    maxCalories,
    minProtein,
    maxProtein,
    minFat,
    maxFat,
    minCarbs,
    maxCarbs,
    minSugar,
    maxSugar,
  ]);

  return (
    <>
      <form className={styles['search-container']}>
        <div className={styles['search-bar']}>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
            width="10%"
            viewBox="0 0 512 512"
            onClick={showAdvanced}
          >
            <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
          </svg>
        </div>

        {advanced && (
          <div className={styles['advanced-search']}>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="cuisine">Cuisine</label>
              <select
                onChange={(e) => setCuisine(e.target.value)}
                id="cuisine"
                name="cuisine"
              >
                <option value="">Any</option>
                <option value="african">African</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
                <option value="vietnamese">Vietnamese</option>
                <option value="thai">Thai</option>
                <option value="indian">Indian</option>
                <option value="british">British</option>
                <option value="irish">Irish</option>
                <option value="french">French</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="spanish">Spanish</option>
                <option value="middle eastern">Middle Eastern</option>
                <option value="jewish">Jewish</option>
                <option value="american">American</option>
                <option value="cajun">Cajun</option>
                <option value="southern">Southern</option>
                <option value="greek">Greek</option>
                <option value="german">German</option>
                <option value="nordic">Nordic</option>
                <option value="eastern european">Eastern European</option>
                <option value="caribbean">Caribbean</option>
                <option value="latin american">Latin American</option>
              </select>
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="diet">Diet</label>
              <select
                placeholder="Diet"
                name="diet"
                id="diet"
                onChange={(e) => setDiet(e.target.value)}
              >
                <option value="">Any</option>
                <option value="gluten free">Gluten Free</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="lacto vegetarian">Lacto-Vegetarian</option>
                <option value="ovo vegetarian">Ovo-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescetarian">Pescetarian</option>
                <option value="paleo">Paleo</option>
                <option value="primal">Primal</option>
              </select>
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="intolerances">Intolerances</label>
              <select
                placeholder="Intolerances"
                name="intolerances"
                onChange={(e) => setIntolerances(e.target.value)}
              >
                <option value="">None</option>
                <option value="dairy">Dairy</option>
                <option value="egg">Egg</option>
                <option value="gluten">Gluten</option>
                <option value="grain">Grain</option>
                <option value="peanut">Peanut</option>
                <option value="seafood">Seafood</option>
                <option value="sesame">Sesame</option>
                <option value="shellfish">Shellfish</option>
                <option value="soy">Soy</option>
                <option value="sulfite">Sulfite</option>
                <option value="tree nut">Tree Nut</option>
                <option value="wheat">Wheat</option>
              </select>
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="includeIngredients">Include Ingredients</label>
              <input
                type="text"
                placeholder="bacon, eggs, cheese"
                name="includeIngredients"
                onChange={(e) => setIncludeIngredients(e.target.value)}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="excludeIngredients">Exclude Ingredients</label>
              <input
                type="text"
                placeholder="milk, butter, flour"
                name="excludeIngredients"
                onChange={(e) => setExcludeIngredients(e.target.value)}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="type_">Type</label>
              <select
                placeholder="Type"
                name="type_"
                onChange={(e) => setType_(e.target.value)}
              >
                <option value="">Any</option>
                <option value="main course">Main Course</option>
                <option value="side dish">Side Dish</option>
                <option value="dessert">Dessert</option>
                <option value="appetizer">Appetizer</option>
                <option value="salad">Salad</option>
                <option value="bread">Bread</option>
                <option value="breakfast">Breakfast</option>
                <option value="soup">Soup</option>
                <option value="beverage">Beverage</option>
                <option value="sauce">Sauce</option>
                <option value="drink">Drink</option>
              </select>
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxReadyTime">Max Ready Time</label>
              <input
                type="number"
                placeholder="Max Ready Time"
                name="maxReadyTime"
                onChange={(e) => setMaxReadyTime(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="minCalories">Min Calories</label>
              <input
                type="number"
                placeholder="Min Calories"
                min={0}
                name="minCalories"
                onChange={(e) => setMinCalories(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxCalories">Max Calories</label>
              <input
                type="number"
                placeholder="Max Calories"
                min={0}
                name="maxCalories"
                onChange={(e) => setMaxCalories(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="minProtein">Min Protein</label>
              <input
                type="number"
                placeholder="Min Protein"
                min={0}
                name="minProtein"
                onChange={(e) => setMinProtein(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxProtein">Max Protein</label>
              <input
                type="number"
                placeholder="Max Protein"
                min={0}
                name="maxProtein"
                onChange={(e) => setMaxProtein(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="minFat">Min Fat</label>
              <input
                type="number"
                placeholder="Min Fat"
                min={0}
                name="minFat"
                onChange={(e) => setMinFat(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxFat">Max Fat</label>
              <input
                type="number"
                placeholder="Max Fat"
                min={0}
                name="maxFat"
                onChange={(e) => setMaxFat(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="minCarbs">Min Carbs</label>
              <input
                type="number"
                placeholder="Min Carbs"
                min={0}
                name="minCarbs"
                onChange={(e) => setMinCarbs(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxCarbs">Max Carbs</label>
              <input
                type="number"
                placeholder="Max Carbs"
                min={0}
                name="maxCarbs"
                onChange={(e) => setMaxCarbs(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="minSugar">Min Sugar</label>
              <input
                type="number"
                placeholder="Min Sugar"
                min={0}
                name="minSugar"
                onChange={(e) => setMinSugar(parseInt(e.target.value))}
              />
            </div>
            <div className={styles['advanced-search-item']}>
              <label htmlFor="maxSugar">Max Sugar</label>
              <input
                type="number"
                placeholder="Max Sugar"
                min={0}
                name="maxSugar"
                onChange={(e) => setMaxSugar(parseInt(e.target.value))}
              />
            </div>
          </div>
        )}
      </form>
      <div className={styles['recipe-results']}>
        {results.map((result: Recipe) => (
          <Link
            className={styles['recipe-card']}
            key={result.id}
            to={'/recipe/' + result.id}
          >
            <div>
              <img src={result.image} alt={result.title} />
              <h3>{result.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
