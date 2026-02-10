// Node.js implementation of the COBOL Account Management System
// Preserves business logic, data integrity, and menu options

const readline = require('readline');

// In-memory data store (can be replaced with file/db as needed)
let account = {
  id: 'STU001',
  name: 'Default Student',
  balance: 1000.00
};

// Pure business logic functions for testability
function getBalance(acc) {
  return acc.balance;
}

function credit(acc, amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return { success: false, message: 'Invalid amount.' };
  }
  acc.balance += amount;
  return { success: true, message: `Credited ${amount.toFixed(2)}. New balance: ${acc.balance.toFixed(2)}` };
}

function debit(acc, amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return { success: false, message: 'Invalid amount.' };
  }
  if (amount > acc.balance) {
    return { success: false, message: 'Transaction denied. Insufficient funds.' };
  }
  acc.balance -= amount;
  return { success: true, message: `Debited ${amount.toFixed(2)}. New balance: ${acc.balance.toFixed(2)}` };
}

// CLI functions (unchanged, but now use pure logic)
function displayMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function viewBalanceCLI() {
  console.log(`Current balance: ${account.balance.toFixed(2)}`);
}

function creditAccountCLI(rl) {
  rl.question('Enter amount to credit: ', (input) => {
    const amount = parseFloat(input);
    const result = credit(account, amount);
    console.log(result.message);
    mainMenu(rl);
  });
}

function debitAccountCLI(rl) {
  rl.question('Enter amount to debit: ', (input) => {
    const amount = parseFloat(input);
    const result = debit(account, amount);
    console.log(result.message);
    mainMenu(rl);
  });
}

function mainMenu(rl) {
  displayMenu();
  rl.question('Enter your choice (1-4): ', (choice) => {
    switch (choice.trim()) {
      case '1':
        viewBalanceCLI();
        mainMenu(rl);
        break;
      case '2':
        creditAccountCLI(rl);
        break;
      case '3':
        debitAccountCLI(rl);
        break;
      case '4':
        console.log('Exiting the program. Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        mainMenu(rl);
    }
  });
}

function startApp() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  mainMenu(rl);
}

if (require.main === module) {
  startApp();
}

// Export pure functions and account for testing
module.exports = {
  getBalance,
  credit,
  debit,
  account,
};
