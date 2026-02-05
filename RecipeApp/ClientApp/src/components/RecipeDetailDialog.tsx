import type { Recipe } from '../types';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  Body1,
  Body2,
  Caption1,
  Subtitle1,
  Divider,
  Badge,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  Save24Regular,
  Cart24Regular,
  Lightbulb24Regular,
  Food24Regular,
  Clock24Regular,
  Person24Regular,
} from '@fluentui/react-icons';

interface Props {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  onShoppingList: () => void;
  isSaved?: boolean;
  saving?: boolean;
}

export function RecipeDetailDialog({
  recipe,
  open,
  onClose,
  onSave,
  onShoppingList,
  isSaved = false,
  saving = false,
}: Props) {
  const cookTime = recipe.cookTimeMinutes || 30;
  const skillLevel = recipe.skillLevel || 'Beginner';
  const description = recipe.description || `A delicious ${recipe.title.toLowerCase()} recipe.`;

  const skillLevelColor = skillLevel === 'Beginner' ? 'success' : skillLevel === 'Intermediate' ? 'warning' : 'danger';

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: '600px', borderRadius: '16px' }}>
        <DialogTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={onClose}
            />
          }
        >
          <div className="flex items-center gap-2">
            <Food24Regular className="text-emerald-600" />
            {recipe.title}
          </div>
        </DialogTitle>
        <DialogBody>
          <DialogContent className="max-h-[60vh] overflow-y-auto">
            {/* Description */}
            <Body1 className="text-gray-600 mb-4">{description}</Body1>

            {/* Stats badges */}
            <div className="flex items-center gap-3 mb-4">
              <Badge
                appearance="tint"
                color={skillLevelColor}
                icon={<Person24Regular />}
                size="large"
              >
                {skillLevel}
              </Badge>
              <Badge
                appearance="tint"
                color="informative"
                icon={<Clock24Regular />}
                size="large"
              >
                {cookTime} min
              </Badge>
              <Badge
                appearance="tint"
                color="subtle"
                icon={<Food24Regular />}
                size="large"
              >
                {recipe.ingredients.length} ingredients
              </Badge>
            </div>

            <Divider className="my-4" />

            {/* Ingredients */}
            <div className="mb-4">
              <Subtitle1 className="mb-2 block">Ingredients</Subtitle1>
              <ul className="list-disc list-inside space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    <Body2>{ing}</Body2>
                  </li>
                ))}
              </ul>
            </div>

            <Divider className="my-4" />

            {/* Instructions */}
            <div className="mb-4">
              <Subtitle1 className="mb-2 block">Instructions</Subtitle1>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>
                    <Body2>{step}</Body2>
                  </li>
                ))}
              </ol>
            </div>

            {/* Suggested Additions */}
            {recipe.suggestedAdditions.length > 0 && (
              <>
                <Divider className="my-4" />
                <MessageBar intent="warning" icon={<Lightbulb24Regular />}>
                  <MessageBarBody>
                    <Caption1 className="font-medium">Suggested Additions: </Caption1>
                    <Body2>{recipe.suggestedAdditions.join(', ')}</Body2>
                  </MessageBarBody>
                </MessageBar>
              </>
            )}
          </DialogContent>
        </DialogBody>
        <DialogActions>
          {!isSaved && onSave && (
            <Button
              appearance="primary"
              icon={<Save24Regular />}
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </Button>
          )}
          <Button
            appearance="secondary"
            icon={<Cart24Regular />}
            onClick={onShoppingList}
          >
            Shopping List
          </Button>
          <Button appearance="outline" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
