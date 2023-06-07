const quantityPage = 10;
let quantityRows = 10;
let numberPage = 1;

start();

async function fetchUser() {
  const response = await fetch(
    `https://randomuser.me/api/?page=${numberPage}&results=${quantityRows}&seed=abc`
  );
  return await response.json();
}

async function generateUser(user) {
  return `
  <div class="user cell">
        <img class="avatar" src="${user.picture.large}">
        <div class="data">
        <div class="name">${user.name.first} ${user.name.last}</div>
        <div class="age-gender">
        <span>${user.dob.age} yrs,</span>
        <span class="gender">${user.gender}</span>
        </div>
        </div>
        </div>
        <div class="cell">${user.email}</div>
        <div class="cell">${user.location.street.name} Street, ${user.location.city}, ${user.location.country}</div>
        <div class="cell">${user.phone}</div>
        `;
}

async function renderUsers() {
  const table = document.querySelector(".table");
  const spinner = document.querySelector(".spinner");
  let promises = [];
  const response = await fetchUser();
  response.results.forEach((user) => promises.push(generateUser(user)));
  spinner.classList.add("show");
  const users = await Promise.all(promises);
  let html = "";
  users.forEach((user) => (html += user));
  table.innerHTML = html;
  spinner.classList.remove("show");
}

function nextPage(event) {
  const buttonPrevPage = document.querySelector(".arrow-prev");
  numberPage++;
  if (numberPage <= quantityPage) {
    renderPage(event, buttonPrevPage, quantityPage);
  } else {
    numberPage = quantityPage;
  }
}

function prevPage(event) {
  const buttonNextPage = document.querySelector(".arrow-next");
  numberPage--;
  if (numberPage) {
    renderPage(event, buttonNextPage, 1);
  } else {
    numberPage = 1;
  }
}

async function renderPage(event, element, quantity) {
  const target = event.target;
  await renderUsers();
  renderNumbersPage();
  element.classList.remove("disable");
  if (numberPage === quantity) {
    target.classList.add("disable");
  }
}

async function showRows(event) {
  event.preventDefault();
  quantityRows = +event.target.lastElementChild.value;
  await renderUsers();
  renderNumbersPage();
}

async function start() {
  const pagination = document.querySelector(".pagination");
  const input = document.querySelector(".input");
  await renderUsers();
  pagination.classList.add("show");
  renderNumbersPage();
  input.value = quantityRows;
}

function renderNumbersPage() {
  const numbersPage = document.querySelector(".page-numbers");
  numbersPage.innerHTML = `
  <span class="page-quantity">${numberPage}</span>
  <span class="page-quantity">of</span>
  <span class="page-quantity">${quantityPage}</span>
  `;
}
