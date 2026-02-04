import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  SearchBox,
  TabList,
  Tab,
  Checkbox,
  Button,
  Input,
  InteractionTag,
  InteractionTagPrimary,
  TagGroup,
  Caption1,
  Subtitle2,
  Card,
  CardHeader,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';

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
    <Card className="h-full" style={{ borderRadius: '16px' }}>
      <CardHeader
        header={<Subtitle2>Select Your Ingredients</Subtitle2>}
      />
      <div className="p-4 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <SearchBox
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(_, data) => setSearchTerm(data.value)}
            className="w-full"
          />
          {searchTerm && filteredIngredients.length > 0 && (
            <Card className="absolute z-10 w-full mt-1 max-h-40 overflow-y-auto" style={{ borderRadius: '12px' }}>
              {filteredIngredients.map(ing => (
                <div
                  key={ing.id}
                  onClick={() => { toggleIngredient(ing.name); setSearchTerm(''); }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Checkbox checked={selectedIngredients.includes(ing.name)} />
                  {ing.name}
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Category Tabs */}
        <TabList
          selectedValue={activeCategory || ''}
          onTabSelect={(_, data) => setActiveCategory(data.value as string)}
          size="small"
        >
          {categories.map(cat => (
            <Tab key={cat} value={cat}>
              {cat}
            </Tab>
          ))}
        </TabList>

        {/* Ingredient Grid */}
        {activeCategory && ingredientsByCategory[activeCategory] && (
          <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
            {ingredientsByCategory[activeCategory].map(ing => (
              <Checkbox
                key={ing.id}
                checked={selectedIngredients.includes(ing.name)}
                onChange={() => toggleIngredient(ing.name)}
                label={ing.name}
              />
            ))}
          </div>
        )}

        {/* Custom Ingredient */}
        <div className="flex gap-2">
          <Input
            placeholder="Add custom ingredient..."
            value={customIngredient}
            onChange={(_, data) => setCustomIngredient(data.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
            className="flex-1"
          />
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={addCustomIngredient}
          >
            Add
          </Button>
        </div>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div>
            <Caption1 className="mb-2 block">Selected ({selectedIngredients.length}):</Caption1>
            <TagGroup
              onDismiss={(_, data) => toggleIngredient(data.value)}
              className="flex flex-wrap gap-1"
            >
              {selectedIngredients.map(ing => (
                <InteractionTag
                  key={ing}
                  shape="circular"
                  appearance="brand"
                  value={ing}
                >
                  <InteractionTagPrimary hasSecondaryAction>{ing}</InteractionTagPrimary>
                </InteractionTag>
              ))}
            </TagGroup>
          </div>
        )}
      </div>
    </Card>
  );
}
