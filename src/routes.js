const express = require('express');
const router = express.Router();
const { accounts } = require('./data');

// List accounts
router.get('/accounts', (req, res) => {
  const list = Array.from(accounts.values()).map(({id, name, balance}) => ({id, name, balance}));
  res.json(list);
});

// Get account by id
router.get('/accounts/:id', (req, res) => {
  const acc = accounts.get(req.params.id);
  if (!acc) return res.status(404).json({ error: 'Account not found' });
  res.json({ id: acc.id, name: acc.name, balance: acc.balance });
});

// Transfer
// Body: { from: 'A001', to: 'A002', amount: 100 }
router.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || typeof amount !== 'number') return res.status(400).json({ error: 'Invalid request' });
  if (amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
  if (from === to) return res.status(400).json({ error: 'Cannot transfer to same account' });

  const accFrom = accounts.get(from);
  const accTo = accounts.get(to);
  if (!accFrom || !accTo) return res.status(404).json({ error: 'Account not found' });

  // Simple atomic check/update since Node is single-threaded
  if (accFrom.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

  accFrom.balance -= amount;
  accTo.balance += amount;

  res.json({ success: true, from: { id: accFrom.id, balance: accFrom.balance }, to: { id: accTo.id, balance: accTo.balance } });
});

module.exports = router;
