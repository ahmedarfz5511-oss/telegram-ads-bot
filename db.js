const fs = require('fs');
const DB_FILE = './database.json';

function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, transactions: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  getUser: (id) => {
    const data = loadData();
    return data.users[id] || null;
  },
  createUser: (id, name) => {
    const data = loadData();
    if (!data.users[id]) {
      data.users[id] = { id, name, ads_watched: 0, balance: 0.0, wallet: '' };
      saveData(data);
    }
    return data.users[id];
  },
  watchAd: (id) => {
    const data = loadData();
    if (data.users[id]) {
      data.users[id].ads_watched += 1;
      saveData(data);
      return data.users[id].ads_watched;
    }
    return 0;
  },
  getTopUsers: () => {
    const data = loadData();
    return Object.values(data.users)
      .sort((a, b) => b.ads_watched - a.ads_watched)
      .slice(0, 10);
  },
  addTransaction: (userId, type, amount, details) => {
    const data = loadData();
    const tx = {
      id: Date.now(),
      userId,
      type,
      amount,
      details,
      status: 'pending'
    };
    data.transactions.push(tx);
    saveData(data);
    return tx;
  },
  updateTxStatus: (txId, status) => {
    const data = loadData();
    const tx = data.transactions.find(t => t.id == txId);
    if (tx) {
      tx.status = status;
      saveData(data);
      return tx;
    }
    return null;
  }
};
    
