const SAVE_KEY = 'click_to_compile_save';

export const saveGame = (data) => {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Save failed: ', e);
    }
};

export const loadGame = () => {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Load failed: ', e);
        return null;
    }
};

export const clearSave = () => {
    localStorage.removeItem(SAVE_KEY);
};