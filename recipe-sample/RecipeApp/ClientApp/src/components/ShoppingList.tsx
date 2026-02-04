import { useState } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-semibold">🛒 Shopping List</h3>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {requiredItems.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Required Ingredients:</h4>
              {requiredItems.map((item, i) => (
                <label key={i} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(listItems.indexOf(item))}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.name}</span>
                </label>
              ))}
            </div>
          )}
          
          {recommendedItems.length > 0 && (
            <div>
              <h4 className="font-medium text-amber-700 mb-2">💡 Recommended (Optional):</h4>
              {recommendedItems.map((item, i) => (
                <label key={i} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(listItems.indexOf(item))}
                    className="w-5 h-5 text-amber-600"
                  />
                  <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 py-3 flex gap-2">
          <button
            onClick={printList}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🖨️ Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
