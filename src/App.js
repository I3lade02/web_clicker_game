import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CodeClicker from './components/CodeClicker';
import CodeStatsPanel from './components/CodeStatsPanel';
import UpgradeCard from './components/UpgradeCard';
import GeneratorCard from './components/GeneratorCard';
import PrestigeUpgradeCard from './components/PrestigeUpgradeCard';
import AchievementToast from './components/AchievementToast';
import AchievementsPanel from './components/AchievementsPanel';
import ProjectsPanel from './components/ProjectsPanel';
import { upgrades } from './features/upgrades';
import { generators } from './features/generators';
import { prestigeUpgrades } from './features/prestigeUpgrades';
import { achievements } from './features/achievements';
import { saveGame, loadGame } from './utils/saveManager';
import { projects as defaultProjects } from './features/projects';
import { Toast, ToastContainer } from 'react-bootstrap';
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
  const [showAchievements, setShowAchievements] = useState(false);
  const [projectList, setProjectList] = useState(defaultProjects);
  const [showProjects, setShowProjects] = useState(false);
  const [recentProjects, setRecentProjects] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

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

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const handleBuyGenerator = (generator, cost) => {
    const qty = purchasedGenerators[generator.id] || 0;
    const dynamicCost = cost;
    if (linesOfCode >= dynamicCost) {
      setLinesOfCode((prev) => prev - dynamicCost);
      setPurchasedGenerators((prev) => ({
        ...prev,
        [generator.id]: qty + 1
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

  const handleProjectComplete = (projectId) => {
  setProjectList((prev) =>
    prev.map((p) =>
      p.id === projectId ? { ...p, completed: true } : p
    )
  );
  const completed = defaultProjects.find(p => p.id === projectId);
  if (completed?.reward?.type === 'clickPower') {
    setClickPower(prev => prev + completed.reward.value);
  } else if (completed?.reward?.type === 'refactorPoints') {
    setRefactorPoints(prev => prev + completed.reward.value);
  }
  setRecentProjects(completed);
  setTimeout(() => setRecentProjects(null), 4000);
};

  return (
    <div className="container text-center mt-5">
      <h1>Click to Compile</h1>
      <button
        className='btn btn-outline-secondary position-absolute top-0 end-0 m-3'
        onClick={() => setShowAchievements(true)}>
          🏆 Achievements
      </button>
      <button 
        className='btn btn-outline-primary position-absolute top-0 start-0 m-3'
        onClick={() => setShowProjects(true)}
      >
        📦 Projects
      </button>
      <select
        className='form-select w-auto d-inline-block position-absolute top-0 start-50 translate-middle-x m-3'
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">🌞 Light</option>
        <option value="matrix">💻 Matrix</option>
        <option value="vscode">🧪 VS Code</option>
        <option value="retro">🕹 Retro Terminal</option>
        <option value="lofi">🎧 Lofi</option>
      </select>
        
      <CodeStatsPanel loc={linesOfCode} clickPower={clickPower + clickBonus} refactorPoints={refactorPoints} generatorIncome={generatorIncome} />
      <CodeClicker onClick={handleClick} clickValue={clickPower + clickBonus}/>

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
        {generators.map((gen) => {
          const qty = purchasedGenerators[gen.id] || 0;
          const dynamicCost = gen.baseCost * Math.pow(1.15, qty);
          return (
            <div className='col-md-4 mb-3' key={gen.id}>
              <GeneratorCard
                generator={gen}
                quantity={qty}
                currentCost={dynamicCost}
                onBuy={() => handleBuyGenerator(gen, dynamicCost)}
                disabled={linesOfCode < dynamicCost}
              />
        </div>
          );
        })}

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
      <AchievementsPanel
        show={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlocked={unlockedAchievements}
        stats={{ totalClicks, totalLinesOfCode}}
      />

      <ProjectsPanel
        show={showProjects}
        onClose={() => setShowProjects(false)}
        projects={projectList}
        onComplete={handleProjectComplete}
        totalLinesOfCode={totalLinesOfCode}
      />

      {recentProjects && (
        <ToastContainer position='top-center' className='p-3'>
          <Toast bg='info' show={true} delay={4000} autohide>
            <Toast.Header closeButton={false}>
              <strong className='me-auto'>Project Completed</strong>
            </Toast.Header>
            <Toast.Body>
              You completed: <strong>{recentProjects.name}</strong>!🎉
            </Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
    </div>
  );
}

export default App;