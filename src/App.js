import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CodeClicker from './components/CodeClicker';
import CodeStatsPanel from './components/CodeStatsPanel';
import UpgradeCard from './components/UpgradeCard';
import GeneratorCard from './components/GeneratorCard';
import PrestigeUpgradeCard from './components/PrestigeUpgradeCard';
import AchievementToast from './components/AchievementToast';
import { upgrades } from './features/upgrades';
import { generators } from './features/generators';
import { prestigeUpgrades } from './features/prestigeUpgrades';
import { achievements } from './features/achievements';
import { saveGame, loadGame } from './utils/saveManager';
import './styles/main.css';

function App() {
  const [linesOfCode, setLinesOfCode] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [totalLinesOfCode, setTotalLinesOfCode] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState([]);
  const [purchasedGenerators, setPurchasedGenerators] = useState({});
  const [refactorPoints, setRefactorPoints] = useState(0);
  const [purchasedPrestigeUpgrades, setPurchasedPrestigeUpgrades] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [recentAchievement, setRecentAchievement] = useState(null);

  const clickBonus = purchasedPrestigeUpgrades.includes('click-boost') ? refactorPoints : 0;
  const generatorMultiplier = purchasedPrestigeUpgrades.includes('generator-efficiency') ? 1 + refactorPoints * 0.1 : 1;

  const generatorIncome = generators.reduce((sum, gen) => {
    const qty = purchasedGenerators[gen.id] || 0;
    return sum + qty * gen.locPerSecond * generatorMultiplier;
  }, 0);

  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setLinesOfCode(saved.linesOfCode || 0);
      setClickPower(saved.clickPower || 1);
      setTotalLinesOfCode(saved.totalLinesOfCode || 0);
      setTotalClicks(saved.totalClicks || 0);
      setPurchasedUpgrades(saved.purchasedUpgrades || []);
      setPurchasedGenerators(saved.purchasedGenerators || {});
      setRefactorPoints(saved.refactorPoints || 0);
      setPurchasedPrestigeUpgrades(saved.purchasedPrestigeUpgrades || []);
      setUnlockedAchievements(saved.unlockedAchievements || []);
    }
  }, []);

  useEffect(() => {
    saveGame({
      linesOfCode,
      clickPower,
      totalLinesOfCode,
      totalClicks,
      purchasedUpgrades,
      purchasedGenerators,
      refactorPoints,
      purchasedPrestigeUpgrades,
      unlockedAchievements
    });
  }, [linesOfCode, clickPower, totalLinesOfCode, totalClicks, purchasedUpgrades, purchasedGenerators, refactorPoints, purchasedPrestigeUpgrades, unlockedAchievements]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (generatorIncome > 0) {
        setLinesOfCode(prev => prev + generatorIncome);
        setTotalLinesOfCode(prev => prev + generatorIncome);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [generatorIncome]);

  useEffect(() => {
    const stats = { totalLinesOfCode, totalClicks };
    achievements.forEach((ach) => {
      if (!unlockedAchievements.includes(ach.id) && ach.condition(stats)) {
        setUnlockedAchievements((prev) => [...prev, ach.id]);
        setRecentAchievement(ach);
        setTimeout(() => setRecentAchievement(null), 4000);
      }
    });
  }, [totalLinesOfCode, totalClicks, unlockedAchievements]);

  const handleClick = () => {
    setLinesOfCode((prev) => prev + clickPower + clickBonus);
    setTotalLinesOfCode((prev) => prev + clickPower + clickBonus);
    setTotalClicks((prev) => prev + 1);
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

  const handleBuyPrestigeUpgrade = (upgrade) => {
    if (refactorPoints >= upgrade.cost && !purchasedPrestigeUpgrades.includes(upgrade.id)) {
      setRefactorPoints(prev => prev - upgrade.cost);
      setPurchasedPrestigeUpgrades(prev => [...prev, upgrade.id]);
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
      setTotalClicks(0);
      setClickPower(1);
      setPurchasedUpgrades([]);
      setPurchasedGenerators({});
      setUnlockedAchievements([]);
      setRefactorPoints(prev => prev + gain);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>Click to Compile</h1>
      <CodeStatsPanel loc={linesOfCode} clickPower={clickPower + clickBonus} refactorPoints={refactorPoints} generatorIncome={generatorIncome} />
      <CodeClicker onClick={handleClick} />

      <div className="mt-4">
        <button className="btn btn-warning" onClick={handleRefactor}>
          Rewrite From Scratch (Gain {calculateRefactorGain()} RP)
        </button>
      </div>

      {recentAchievement && <AchievementToast achievement={recentAchievement} />}

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

      <h3 className='mt-5'>Refactor Upgrades</h3>
      <div className='row mt-3'>
        {prestigeUpgrades.map((upgrade) => (
          <div className='col-md-6 mb-3' key={upgrade.id}>
            <PrestigeUpgradeCard
              upgrade={upgrade}
              onBuy={() => handleBuyPrestigeUpgrade(upgrade)}
              disabled={refactorPoints < upgrade.cost || purchasedPrestigeUpgrades.includes(upgrade.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;