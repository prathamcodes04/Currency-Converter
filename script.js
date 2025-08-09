const BASE_URL = "https://api.frankfurter.app/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amount = document.querySelector(".amount input");

const countryList = {
  USD: "US",
  EUR: "FR", 
  GBP: "GB",
  INR: "IN",
  AUD: "AU",
  CAD: "CA",
  SGD: "SG",
  JPY: "JP",
  CNY: "CN",
};

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amtVal = parseFloat(amount.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  if (from === to) {
    msg.innerText = `${amtVal} ${from} = ${amtVal} ${to}`;
    return;
  }

  try {
    const URL = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    let data = await response.json();
    let rate = data.rates[to];

    if (!rate) {
      throw new Error("Exchange rate not found");
    }

    msg.innerText = `${amtVal} ${from} = ${rate} ${to}`;
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Failed to fetch exchange rates. Please try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (countryCode) {
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    if (img) img.src = newSrc;
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
  // Update flags on load
  updateFlag(fromCurr);
  updateFlag(toCurr);
});
