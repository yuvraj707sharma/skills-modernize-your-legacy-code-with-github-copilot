const { expect } = require('chai');
const { getBalance, credit, debit } = require('./index');

describe('Account Management System', function () {
  let account;

  beforeEach(function () {
    // Reset account state before each test
    account = { id: 'STU001', name: 'Default Student', balance: 1000.00 };
  });

  it('TC-01: View account balance', function () {
    expect(getBalance(account)).to.equal(1000.00);
  });

  it('TC-02: Credit account with valid amount', function () {
    const result = credit(account, 200);
    expect(result.success).to.be.true;
    expect(account.balance).to.equal(1200.00);
    expect(result.message).to.include('Credited 200.00');
  });

  it('TC-03: Debit account with valid amount', function () {
    const result = debit(account, 300);
    expect(result.success).to.be.true;
    expect(account.balance).to.equal(700.00);
    expect(result.message).to.include('Debited 300.00');
  });

  it('TC-04: Debit account with excessive amount', function () {
    const result = debit(account, 2000);
    expect(result.success).to.be.false;
    expect(account.balance).to.equal(1000.00);
    expect(result.message).to.equal('Transaction denied. Insufficient funds.');
  });

  it('TC-05: Credit account with invalid input', function () {
    const result = credit(account, 'abc');
    expect(result.success).to.be.false;
    expect(account.balance).to.equal(1000.00);
    expect(result.message).to.equal('Invalid amount.');
  });

  it('TC-06: Debit account with invalid input', function () {
    const result = debit(account, 'xyz');
    expect(result.success).to.be.false;
    expect(account.balance).to.equal(1000.00);
    expect(result.message).to.equal('Invalid amount.');
  });

  it('TC-09: Data integrity after multiple ops', function () {
    credit(account, 100);
    debit(account, 50);
    expect(account.balance).to.equal(1050.00);
  });

  it('TC-10: Prevent negative balance', function () {
    account.balance = 10;
    const result = debit(account, 20);
    expect(result.success).to.be.false;
    expect(account.balance).to.equal(10);
    expect(result.message).to.equal('Transaction denied. Insufficient funds.');
  });
});
