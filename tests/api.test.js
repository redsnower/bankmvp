const app = require('../src/index');
const { accounts } = require('../src/data');

let server;
let base;

beforeAll(done => {
  // start server on ephemeral port
  server = app.listen(0, () => {
    const port = server.address().port;
    base = `http://127.0.0.1:${port}`;
    done();
  });
});

afterAll(done => {
  server.close(done);
});

beforeEach(()=>{
  // reset balances before each test
  accounts.get('A001').balance = 1000;
  accounts.get('A002').balance = 800;
  accounts.get('A003').balance = 1200;
  accounts.get('A004').balance = 500;
});

test('GET /api/accounts returns accounts', async ()=>{
  const res = await fetch(base + '/api/accounts');
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBe(4);
});

test('GET /api/accounts/:id returns account', async ()=>{
  const res = await fetch(base + '/api/accounts/A001');
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.id).toBe('A001');
  expect(typeof body.balance).toBe('number');
});

test('POST /api/transfer succeeds with sufficient funds', async ()=>{
  const res = await fetch(base + '/api/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'A001', to: 'A002', amount: 250 }) });
  expect(res.status).toBe(200);
  const body = await res.json();
  expect(body.success).toBeTruthy();
  expect(body.from.balance).toBe(750);
  expect(body.to.balance).toBe(1050);
});

test('POST /api/transfer fails when insufficient funds', async ()=>{
  const res = await fetch(base + '/api/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'A004', to: 'A002', amount: 1000 }) });
  expect(res.status).toBe(400);
  const body = await res.json();
  expect(body.error).toMatch(/Insufficient/);
});

test('POST /api/transfer fails on invalid input', async ()=>{
  const res = await fetch(base + '/api/transfer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'A001', to: 'A001', amount: 10 }) });
  expect(res.status).toBe(400);
});
