const balance = document.getElementById('balance'),
  moneyPlus = document.getElementById('money-plus'),
  moneyMinus = document.getElementById('money-minus'),
  list = document.getElementById('list'),
  form = document.getElementById('form'),
  text = document.getElementById('text'),
  amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Введите название и сумму');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: parseFloat(amount.value),
    };

    transactions.push(transaction);

    addTransactionDom(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000);
}

// Add transactions to DOM list
function addTransactionDom(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const listItem = document.createElement('li');

  // Add class based on value
  listItem.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  listItem.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
  `;

  list.appendChild(listItem);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `${total}₽`;
  moneyPlus.innerText = `${income}₽`;
  moneyMinus.innerText = `${expense}₽`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDom);
  updateValues();
}

init();

// Event listeners
form.addEventListener('submit', addTransaction);
