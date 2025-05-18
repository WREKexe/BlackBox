
import React, { useState, useEffect } from 'react';
import { fetchEntries, addEntry } from './googleSheetService';

const labels = ['Genre', 'Mood', 'Modifier'];

export default function App() {
  const [data, setData] = useState({ Genre: [], Mood: [], Modifier: [] });
  const [combo, setCombo] = useState({ Genre: '', Mood: '', Modifier: '' });
  const [form, setForm] = useState({ type: 'Genre', name: '', tags: '' });

  useEffect(() => {
    async function loadData() {
      const entries = await fetchEntries();
      const categorized = { Genre: [], Mood: [], Modifier: [] };
      entries.forEach(({ Type, Name }) => {
        if (categorized[Type]) categorized[Type].push(Name);
      });
      setData(categorized);
      setCombo({
        Genre: randomPick(categorized.Genre),
        Mood: randomPick(categorized.Mood),
        Modifier: randomPick(categorized.Modifier)
      });
    }
    loadData();
  }, []);

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const reroll = (type) => {
    setCombo((prev) => ({ ...prev, [type]: randomPick(data[type]) }));
  };

  const handleAdd = async () => {
    await addEntry(form.type, form.name, form.tags);
    alert('Added!');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🎛️ BlackBox.exe</h1>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-2xl py-3 font-medium shadow"
                onClick={() => {
                  setCombo({
                    Genre: randomPick(data.Genre),
                    Mood: randomPick(data.Mood),
                    Modifier: randomPick(data.Modifier)
                  });
                }}>
          🎲 Randomize All
        </button>
        <div className="bg-neutral-800 p-4 rounded-xl space-y-4 shadow-lg">
          {labels.map(label => (
            <div className="flex justify-between items-center" key={label}>
              <div>
                <span className="text-sm text-neutral-400">{label}</span>
                <div className="text-xl font-semibold">{combo[label]}</div>
              </div>
              <button className="text-sm bg-neutral-700 px-3 py-1 rounded-full hover:bg-neutral-600"
                      onClick={() => reroll(label)}>⟳</button>
            </div>
          ))}
        </div>
        <div className="bg-neutral-800 p-4 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold">+ Add New Entry</h2>
          <select className="bg-neutral-700 rounded-lg p-2 w-full"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
            {labels.map(option => <option key={option}>{option}</option>)}
          </select>
          <input className="bg-neutral-700 rounded-lg p-2 w-full" placeholder="Name"
                 onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="bg-neutral-700 rounded-lg p-2 w-full" placeholder="Tags (comma separated)"
                 onChange={e => setForm({ ...form, tags: e.target.value })} />
          <button className="bg-green-600 hover:bg-green-700 rounded-lg py-2 w-full"
                  onClick={handleAdd}>➕ Add to Sheet</button>
        </div>
      </div>
    </div>
  );
}
