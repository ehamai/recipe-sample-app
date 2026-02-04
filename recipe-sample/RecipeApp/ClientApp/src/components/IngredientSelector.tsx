import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  selectedIngredients: string[];
  onSelectionChange: (ingredients: string[]) => void;
}

export function IngredientSelector({ selectedIngredients, onSelectionChange }: Props) {
  const [ingredientsByCategory, setIngredientsByCategory] = useState<Record<string, { id: number; name: string }[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [customIngredient, setCustomIngredient] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('/api/ingredients');
      setIngredientsByCategory(response.data);
      const categories = Object.keys(response.data);
      if (categories.length > 0) setActiveCategory(categories[0]);
    } catch (error) {
      console.error('Failed to fetch ingredients:', error);
    }
  };

  const toggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      onSelectionChange(selectedIngredients.filter(i => i !== name));
    } else {
      onSelectionChange([...selectedIngredients, name]);
    }
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      onSelectionChange([...selectedIngredients, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  const allIngredients = Object.values(ingredientsByCategory).flat();
  const filteredIngredients = searchTerm
    ? allIngredients.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const categories = Object.keys(ingredientsByCategory);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Select Your Ingredients</h2>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        {searchTerm && filteredIngredients.length > 0 && (
          <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
            {filteredIngredients.map(ing => (
              <button
                key={ing.id}
                onClick={() => { toggleIngredient(ing.name); setSearchTerm(''); }}
                className={`w-full text-left px-4 py-2 hover:bg-emerald-50 ${
                  selectedIngredients.includes(ing.name) ? 'bg-emerald-100' : ''
                }`}
              >
                {ing.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ingredient Grid */}
      {activeCategory && ingredientsByCategory[activeCategory] && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {ingredientsByCategory[activeCategory].map(ing => (
            <button
              key={ing.id}
              onClick={() => toggleIngredient(ing.name)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                selectedIngredients.includes(ing.name)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {ing.name}
            </button>
          ))}
        </div>
      )}

      {/* Custom Ingredient */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom ingredient..."
          value={customIngredient}
          onChange={(e) => setCustomIngredient(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={addCustomIngredient}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Add
        </button>
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected ({selectedIngredients.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ing => (
              <span
                key={ing}
                className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
              >
                {ing}
                <button
                  onClick={() => toggleIngredient(ing)}
                  className="hover:text-emerald-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
