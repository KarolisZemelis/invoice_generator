/**
 * Function to generate HTML dynamically based on variable name.
 * @param {string} variableValue - The value of the variable.
 * @returns {string} - A string representing the HTML content.
 */
function generateHtml(className, variableValue) {
  return `<div class="${className}">${variableValue}</div>`;
}

/**
 * Function to find  DOM object with given class name and assign it to an object
 * @param {string} className - The value of the className found in DOM
 * @returns {variable} - Selected variable from DOM
 */

function findByClass(className, parentElement = document) {
  const domVariable = parentElement.querySelector(`.${className}`);
  return domVariable;
}

function numberToWordsLT(amount) {
  const ones = [
    "",
    "vienas",
    "du",
    "trys",
    "keturi",
    "penki",
    "šeši",
    "septyni",
    "aštuoni",
    "devyni",
  ];
  const teens = [
    "",
    "vienuolika",
    "dvylika",
    "trylika",
    "keturiolika",
    "penkiolika",
    "šešiolika",
    "septyniolika",
    "aštuoniolika",
    "devyniolika",
  ];
  const tens = [
    "",
    "dešimt",
    "dvidešimt",
    "trisdešimt",
    "keturiasdešimt",
    "penkiasdešimt",
    "šešiasdešimt",
    "septyniasdešimt",
    "aštuoniasdešimt",
    "devyniasdešimt",
  ];
  const hundreds = [
    "",
    "šimtas",
    "du šimtai",
    "trys šimtai",
    "keturi šimtai",
    "penki šimtai",
    "šeši šimtai",
    "septyni šimtai",
    "aštuoni šimtai",
    "devyni šimtai",
  ];
  const thousands = ["", "tūkstantis", "tūkstančiai", "tūkstančių"];

  function getOnesAndTens(n) {
    if (n < 10) return ones[n];
    if (n > 10 && n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
  }

  function convertPart(n) {
    if (n === 0) return "";
    const h = Math.floor(n / 100);
    const t = n % 100;
    return ((h ? hundreds[h] + " " : "") + (t ? getOnesAndTens(t) : "")).trim();
  }

  function getThousandsPart(n) {
    if (n === 0) return "";
    if (n === 1) return "vienas tūkstantis";
    const rem = n % 10;
    const thousandsForm =
      n % 100 >= 11 && n % 100 <= 19
        ? thousands[3] // "tūkstančių" for teens
        : rem === 1
        ? thousands[1] // "tūkstantis" for singular
        : rem >= 2 && rem <= 9
        ? thousands[2] // "tūkstančiai" for plural nominative
        : thousands[3]; // "tūkstančių" for plural genitive
    return convertPart(n) + " " + thousandsForm;
  }

  function getEurosWord(euros) {
    if (euros % 10 === 1 && euros % 100 !== 11) return "euras";
    if (
      euros % 10 >= 2 &&
      euros % 10 <= 9 &&
      (euros % 100 < 10 || euros % 100 >= 20)
    )
      return "eurai";
    return "eurų";
  }

  // Parse amount into euros and cents
  const [euros, cents] = amount.toFixed(2).split(".").map(Number);

  if (euros === 0 && cents === 0) return "nulis eurų ir 00 ct";

  const eurText =
    euros < 1000
      ? convertPart(euros)
      : getThousandsPart(Math.floor(euros / 1000)) +
        (euros % 1000 !== 0 ? " " + convertPart(euros % 1000) : "");

  const eurWord = getEurosWord(euros);
  const ctText = cents < 10 ? "0" + cents : cents;

  return (
    (eurText ? eurText + " " + eurWord : "") +
    " ir " +
    ctText +
    " ct"
  ).trim();
}

const url = "https://in3.dev/inv/";

async function getData() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status : ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

//gets invoice details
(async function getInvoiceData() {
  try {
    const invoiceData = await getData();

    for (const key in invoiceData) {
      if (invoiceData.hasOwnProperty(key)) {
        // Check if there's an element in the document with a class matching the current key

        if (document.querySelector(`.${key}`)) {
          findByClass(`${key}`).innerHTML += generateHtml(
            `${key}`,
            invoiceData[key]
          );
        } else {
          console.log(`No element found with class "${key}".`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();

//gets buyer data and sends it to DOM
(async function getBuyerData() {
  try {
    const invoiceData = await getData();
    const buyerDetails = invoiceData.company.buyer;
    const buyerDetailsHtml = document.querySelector(".buyer_details");

    for (const key in buyerDetails) {
      if (buyerDetails.hasOwnProperty(key)) {
        // Check if there's an element in the document with a class matching the current key
        if (document.querySelector(`.${key}`)) {
          findByClass(`${key}`, buyerDetailsHtml).innerHTML += generateHtml(
            `${key}`,
            buyerDetails[key]
          );
        } else {
          console.log(`No element found with class "${key}".`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();

//gets seller data and sends it to DOM
(async function getSellerData() {
  try {
    const invoiceData = await getData();
    const sellerDetails = invoiceData.company.seller;
    const sellerDetailsHtml = document.querySelector(".seller_details");

    for (const key in sellerDetails) {
      if (sellerDetails.hasOwnProperty(key)) {
        // Check if there's an element in the document with a class matching the current key

        if (sellerDetailsHtml.querySelector(`.${key}`)) {
          findByClass(`${key}`, sellerDetailsHtml).innerHTML += generateHtml(
            `${key}`,
            sellerDetails[key]
          );
        } else {
          console.log(`No element found with class "${key}".`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();

// gets product details for the invoice
async function getProductData() {
  try {
    const invoiceData = await getData();
    const items = invoiceData.items;
    const tableHtml = document.querySelector("tbody");
    let nrCounter = 1;
    let discountAmount = 0;
    let allProductTotal = 0;

    for (let i = 0; i < items.length; i++) {
      const tableRow = document.createElement("tr");
      tableHtml.append(tableRow);
      const tableData = document.createElement("td");
      tableData.innerHTML += nrCounter;
      tableRow.append(tableData);

      nrCounter++;
      for (const key in items[i]) {
        const tableData = document.createElement("td");
        if (key === "discount") {
          if (items[i][key].type === "fixed") {
            discountAmount = parseFloat(items[i][key].value);
            tableData.innerHTML += discountAmount.toFixed(2);
          } else if (items[i][key].type === "percentage") {
            discountAmount = parseFloat(
              items[i].price * (items[i][key].value / 100)
            ).toFixed(2);
            tableData.innerHTML += discountAmount;
          }
        } else {
          tableData.innerHTML += items[i][key];
        }
        tableRow.append(tableData);
      }

      const itemPrice = parseFloat(items[i].price).toFixed(2);
      const itemQty = parseFloat(items[i].quantity).toFixed(2);
      const priceAfterDiscount = itemPrice - parseFloat(discountAmount);
      const productTotal = parseFloat(
        (priceAfterDiscount * itemQty).toFixed(2)
      );

      allProductTotal += productTotal;

      tableRow.append(
        Object.assign(document.createElement("td"), {
          innerHTML: productTotal,
        })
      );

      discountAmount = 0;
    }

    return allProductTotal.toFixed(2);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    throw error;
  }
}

// Use elsewhere
(async function populateTotalSection() {
  const totals = await getProductData();
  const totalsNumb = parseFloat(totals);
  const data = await getData();
  const shippingPrice = parseFloat(data.shippingPrice);
  const vat = (totalsNumb + shippingPrice) * 0.21;
  const invoiceTotal = Number(totalsNumb) + Number(shippingPrice) + Number(vat);

  numberToWordsLT(invoiceTotal);

  console.log(typeof totalsNumb);
  console.log(typeof shippingPrice);
  console.log(typeof vat);

  findByClass("itemTotal").innerHTML = `${totals}€`;
  findByClass("transport").innerHTML = `${shippingPrice}€`;
  findByClass("totalVat").innerHTML = `${vat.toFixed(2)}€`;
  findByClass("invoiceTotal").innerHTML = `${invoiceTotal.toFixed(2)}€`;
  findByClass("totalWords").innerHTML = `${numberToWordsLT(invoiceTotal)}`;
})();
