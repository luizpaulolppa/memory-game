import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { MdOutlineRefresh } from 'react-icons/md';
import './App.css';

type DataProp = {
  id: string;
  label: string
  selected: boolean
  confirmed: boolean
}

function App() {
  const [items, setItems] = useState<DataProp[]>([]);

  function mixNumbers(numbers: number[]): number[] {
    return numbers.sort(() => Math.random() - 0.5);
  }

  function getRandomNumber(max: number = 100): number {
    return Number(Math.floor(Math.random() * max))
  }

  function getRandomNumbers(amount: number = 8): number[] {
    const list = new Set<number>([])
    while (list.size <= (amount - 1)) {
      list.add(getRandomNumber())
    }
    return Array.from(list);
  }

  function chooseCard(dp: DataProp) {
    if (dp.confirmed) return;

    const selectedItems = items.filter(item => item.selected)
    const selectedItemsIds = selectedItems.map(i => i.id)
    selectedItemsIds.push(dp.id)
    const newItems = items.map(i => ({ ...i, selected: selectedItemsIds.includes(i.id) }));
    setItems(newItems);
  }

  function chooseCardView(dataProp: DataProp) {
    if (dataProp.selected || dataProp.confirmed) {
      return (
        <div
          className="item-selected"
          key={dataProp.id}
          onClick={() => chooseCard(dataProp)}
        >
          {dataProp.label}
        </div>
      )
    }

    return (
      <div
        className="item"
        key={dataProp.id}
        onClick={() => chooseCard(dataProp)}
      >
        ?
      </div>
    )
  }

  function resetGame() {
    const numbers = getRandomNumbers(8)
    let mixedNumbers = mixNumbers([...numbers, ...numbers])
    let items: DataProp[] = []

    for (let itemsA = 0; itemsA < 16; itemsA++) {
      const label = String(mixedNumbers.pop())
      items.push({
        label,
        id: uuidv4(),
        confirmed: false,
        selected: false,
      })
    }
    setItems(items);
  }

  useEffect(() => {
    const selectedItems = items.filter(item => item.selected)
    if (selectedItems.length === 2) {
      setTimeout(() => {
        const [item1, item2] = selectedItems
        if (item1.label === item2.label) {
          const selectedItemsIds = selectedItems.map(i => i.id)
          const confirmedItemsIds = items.filter(item => item.confirmed).map(i => i.id)
          const ids = [...selectedItemsIds, ...confirmedItemsIds]
          const newItems = items.map(i =>
            ({ ...i, confirmed: ids.includes(i.id), selected: false }));
          setItems(newItems);
        } else {
          const newItems = items.map(i => ({ ...i, selected: false }));
          setItems(newItems);
        }
      }, 300);
    }
  }, [items])

  useEffect(() => {
    resetGame();
  }, [])

  return (
    <div>
      <div className="container">
        {items.map(chooseCardView)}
      </div>
      <div className="container-refresh">
        <MdOutlineRefresh size={48} onClick={resetGame} title="Reiniciar Jogo" />
      </div>
    </div>
  );
}

export default App;
