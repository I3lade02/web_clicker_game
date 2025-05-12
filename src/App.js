import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CodeClicker from './components/CodeClicker';
import CodeStatsPanel from './components/CodeStatsPanel';
import UpgradeCard from './components/UpgradeCard';
import { upgrades } from './features/upgrades';
import { saveGame, loadGame } from './utils/saveManager';
import { generators } from './features/generators';
import GeneratorCard from './components/GeneratorCard';
import './styles/main.css';

function App() {
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);
  const [totalLinesOfCode, setTotalLinesOfCode] = useState(0);
  const [purchasedGenerators, setPurchasedGenerators] = useState({});
  const [refactorPoints, setRefactorPoints] = useState(0);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setLinesOfCode(saved.linesOfCode || 0);
      setTotalLinesOfCode(saved.totalLinesOfCode || 0);
      setClickPower(saved.clickPower || 1);
      setPurchasedUpgrades(saved.purchasedUpgrades || []);
      setPurchasedGenerators(saved.purchasedGenerators || {});
      setRefactorPoints(saved.refactorPoints || 0);
    }
  }, []);

  useEffect(() => {
    saveGame({ linesOfCode, clickPower, purchasedUpgrades });
  }, [linesOfCode, clickPower, purchasedUpgrades]);

  useEffect(() => {
    const interval = setInterval(() => {
      let passiveIncome = 0;
      for (const gen of generators) {
        const qty = purchasedGenerators[gen.id] || 0;
        passiveIncome += qty * gen.locPerSecond;
      }
      if (passiveIncome > 0) {
        setLinesOfCode(prev => prev + passiveIncome);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [purchasedGenerators])

  const handleClick = () => {
    setLinesOfCode((prev) => prev + clickPower);
    setTotalLinesOfCode((prev) => prev + clickPower);
  };

  const handleUpgrade = (upgrade) => {
    if (linesOfCode >= upgrade.cost && !purchasedUpgrades.includes(upgrade.id)) {
      setLinesOfCode((prev) => prev - upgrade.cost);
      setClickPower((prev) => prev + upgrade.bonus);
      setPurchasedUpgrades((prev) => [...prev, upgrade.id]);
    }
  };

  const handleBuyGenerator = (generator) => {
    if (linesOfCode >= generator.baseCost) {
      setLinesOfCode((prev) => prev - generator.baseCost);
      setPurchasedGenerators((prev) => ({
        ...prev,
        [generator.id]: (prev[generator.id] || 0) + 1
      }));
    }
  };

  const calculateRefactorGain = () => {
    return Math.floor(Math.sqrt(totalLinesOfCode / 1000));
  };

  const handleRefactor = () => {
    const gain = calculateRefactorGain();
    if (gain > 0 && window.confirm(`Refactor for ${gain} Refactor point(s)? This will reset all progress`)) {
      setLinesOfCode(0);
      setTotalLinesOfCode(0);
      setClickPower(1);
      setPurchasedUpgrades([]);
      setPurchasedGenerators({});
      setRefactorPoints(prev => prev + gain);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Click to Compile</h1>
      <CodeStatsPanel loc={linesOfCode} clickPower={clickPower} refactorPoints={refactorPoints} />
      <CodeClicker onClick={handleClick} />

      <div className="mt-4">
        <button className="btn btn-warning" onClick={handleRefactor}>
          Rewrite From Scratch (Gain {calculateRefactorGain()} RP)
        </button>
      </div>

      <h3 className="mt-5">Upgrades</h3>
      <div className="row mt-3">
        {upgrades.map((upgrade) => (
          <div className="col-md-4 mb-3" key={upgrade.id}>
            <UpgradeCard
              upgrade={upgrade}
              onUpgrade={() => handleUpgrade(upgrade)}
              disabled={linesOfCode < upgrade.cost || purchasedUpgrades.includes(upgrade.id)}
            />
          </div>
        ))}
      </div>

      <h3 className="mt-5">Generators</h3>
      <div className="row mt-3">
        {generators.map((gen) => (
          <div className="col-md-4 mb-3" key={gen.id}>
            <GeneratorCard
              generator={gen}
              quantity={purchasedGenerators[gen.id] || 0}
              onBuy={() => handleBuyGenerator(gen)}
              disabled={linesOfCode < gen.baseCost}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;