import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Checkbox,
  Subtitle2,
  Divider,
} from '@fluentui/react-components';
import {
  Print24Regular,
  Dismiss24Regular,
  Cart24Regular,
  Lightbulb24Regular,
} from '@fluentui/react-icons';

interface ShoppingItem {
  name: string;
  isRecommended: boolean;
  checked: boolean;
}

interface Props {
  items: { name: string; isRecommended: boolean }[];
  onClose: () => void;
}

export function ShoppingList({ items, onClose }: Props) {
  const [listItems, setListItems] = useState<ShoppingItem[]>(
    items.map(i => ({ ...i, checked: false }))
  );

  const toggleItem = (index: number) => {
    setListItems(prev => prev.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const printList = () => {
    const text = listItems.map(i => `${i.checked ? '✓' : '○'} ${i.name}${i.isRecommended ? ' (recommended)' : ''}`).join('\n');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-size: 16px; font-family: sans-serif;">Shopping List\n\n${text}</pre>`);
      printWindow.print();
    }
  };

  const requiredItems = listItems.filter(i => !i.isRecommended);
  const recommendedItems = listItems.filter(i => i.isRecommended);

  return (
    <Dialog open onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
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
            <Cart24Regular />
            Shopping List
          </div>
        </DialogTitle>
        <DialogBody>
          <DialogContent className="max-h-[60vh] overflow-y-auto">
            {requiredItems.length > 0 && (
              <div className="mb-4">
                <Subtitle2 className="mb-2 block">Required Ingredients</Subtitle2>
                <div className="flex flex-col gap-1">
                  {requiredItems.map((item, i) => (
                    <Checkbox
                      key={i}
                      checked={item.checked}
                      onChange={() => toggleItem(listItems.indexOf(item))}
                      label={
                        <span className={item.checked ? 'line-through opacity-50' : ''}>
                          {item.name}
                        </span>
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {recommendedItems.length > 0 && (
              <>
                <Divider className="my-3" />
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Lightbulb24Regular className="text-amber-500" />
                    <Subtitle2>Recommended (Optional)</Subtitle2>
                  </div>
                  <div className="flex flex-col gap-1">
                    {recommendedItems.map((item, i) => (
                      <Checkbox
                        key={i}
                        checked={item.checked}
                        onChange={() => toggleItem(listItems.indexOf(item))}
                        label={
                          <span className={item.checked ? 'line-through opacity-50' : ''}>
                            {item.name}
                          </span>
                        }
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="primary" icon={<Print24Regular />} onClick={printList}>
            Print
          </Button>
          <Button appearance="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
