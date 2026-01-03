// In-memory bank accounts
// Each account { id, name, balance }
const accounts = new Map([
  ["A001", { id: "A001", name: "Alice", balance: 1000 }],
  ["A002", { id: "A002", name: "Bob", balance: 800 }],
  ["A003", { id: "A003", name: "Charlie", balance: 1200 }],
  ["A004", { id: "A004", name: "Diana", balance: 500 }]
]);

module.exports = {
  accounts
};