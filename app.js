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
let invoiceTotal = 0;
// gets product details for the invoice
async function getProductData() {
  try {
    const invoiceData = await getData();
    const items = invoiceData.items;
    const tableHtml = document.querySelector("tbody");
    let nrCounter = 1;
    let itemPrice;
    let discountAmount = 0;
    let tableData;

    for (i = 0; i < items.length; i++) {
      const tableRow = document.createElement("tr");
      tableHtml.append(tableRow);
      tableData = document.createElement("td");
      tableData.innerHTML += nrCounter;
      tableRow.append(tableData);

      //console.log sekcija matematikos tikrinimui

      console.log(items[i]);
      console.log(items[i].description);
      console.log(items[i].discount.type);
      console.log(items[i].discount.value);
      console.log(items[i].price);
      console.log(items[i].quantity);

      //console.log sekcija matematikos tikrinimui

      nrCounter++;
      for (const key in items[i]) {
        const tableData = document.createElement("td");

        //apacioje kodas tvarkosi su stulpeliu : Nuolaida jei items raktas yra discount

        if (key === "discount" && key != "") {
          if (items[i][key].type === "fixed") {
            const tableData = document.createElement("td");
            discountAmount = parseFloat(items[i][key].value);

            tableData.innerHTML += discountAmount.toFixed(2);
            tableRow.append(tableData);

            // jei yra nuolaida ir jei nuolaida yra fixed tuomet pridedam TD ir kaina minus discountAmount
          } else if (items[i][key].type === "percentage" && key != "") {
            const tableData = document.createElement("td");

            discountAmount = parseFloat(
              items[i].price * (items[i][key].value / 100)
            ).toFixed(2);

            tableData.innerHTML += discountAmount;
            tableRow.append(tableData);
          } else {
            const tableData = document.createElement("td");
            tableData.innerHTML = discountAmount;
            tableRow.append(tableData);
          }
        } else {
          tableData.innerHTML += items[i][key];
          tableRow.append(tableData);
        }
      }
      // čia rasom kodą toliau
      itemPrice = parseFloat(items[i].price).toFixed(2);
      const itemQty = parseFloat(items[i].quantity).toFixed(2);
      const priceAfterDicount = itemPrice - parseFloat(discountAmount);

      tableRow.append(
        Object.assign(document.createElement("td"), {
          innerHTML: priceAfterDicount.toFixed(2),
        })
      );

      //nuresetinam discountą kad nebebūtų pridėtas kito ciklo metu jei nebus prekės nuolaidos
      discountAmount = 0;
      // pridedam PVM(%) stulpelio duomeis - visada vienodi

      tableRow.append(
        Object.assign(document.createElement("td"), {
          innerHTML: "21",
        })
      );
      // paskaičiuojame PVM sumą

      const VAT = parseFloat((priceAfterDicount * 0.21 * itemQty).toFixed(2));

      tableRow.append(
        Object.assign(document.createElement("td"), {
          innerHTML: VAT,
        })
      );
      //paskaičiuojam bendrą sumą

      const productTotal = parseFloat(
        (priceAfterDicount * itemQty + VAT).toFixed(2)
      );
      tableRow.append(
        Object.assign(document.createElement("td"), {
          innerHTML: productTotal,
        })
      );
      invoiceTotal += productTotal;
    }
    console.log("invoice total", invoiceTotal);
    findByClass("invoiceTotal").innerHTML += invoiceTotal.toFixed(2);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

console.log("funkcija returnina", getProductData());
