import { useState } from 'react';
import BlueBloods from './components/BlueBloods';
import ArbitrageFinder from './components/ArbitrageFinder';
import BlueBloodCalculator from './components/BlueBloodCalculator';
import SeasonPredictor from './components/SeasonPredictor';
import './App.css';

const TABS = [
  { id: 'bluebloods', label: 'Blue Bloods' },
  { id: 'calculator', label: 'Blue Blood Calculator' },
  { id: 'predictor', label: 'Season Predictor' },
  { id: 'arbitrage', label: 'Arbitrage Finder' },
];

function App() {
  const [activeTab, setActiveTab] = useState('bluebloods');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏈 Sports Dashboard</h1>
      </header>
      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="content">
        {activeTab === 'bluebloods' && <BlueBloods />}
        {activeTab === 'calculator' && <BlueBloodCalculator />}
        {activeTab === 'predictor' && <SeasonPredictor />}
        {activeTab === 'arbitrage' && <ArbitrageFinder />}
      </main>
    </div>
  );
}

export default App;
