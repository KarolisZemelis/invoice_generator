/**
 * Function to generate HTML dynamically based on variable name.
 * @param {string} variableValue - The value of the variable.
 * @returns {string} - A string representing the HTML content.
 */
function generateHtml(className, variableValue) {
  return `<div class="${className}">${variableValue}</div>`;
}

/**
 * Function to find  DOM object with given class name and assign it to an aobject
 * @param {string} className - The value of the className found in DOM
 * @returns {variable} - Selected variable from DOM
 */

function findByClass(className) {
  const domVariable = document.querySelector(`.${className}`);
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

(async function main() {
  try {
    const invoiceData = await getData();

    //gets buyer data and sends it to DOM

    const buyerDetails = invoiceData.company.buyer;
    const buyerName = buyerDetails.name;
    const buyerAddress = buyerDetails.address;
    const buyerCode = buyerDetails.code;
    const buyerVat = buyerDetails.vat;
    const buyerPhone = buyerDetails.phone;
    const buyerEmail = buyerDetails.email;
    findByClass("buyerName").innerHTML += generateHtml("buyerName", buyerName);
    findByClass("buyerAddress").innerHTML += generateHtml(
      "buyerAddress",
      buyerAddress
    );
    findByClass("buyerCode").innerHTML += generateHtml("buyerCode", buyerCode);
    findByClass("buyerVat").innerHTML += generateHtml("buyerVat", buyerVat);
    findByClass("buyerPhone").innerHTML += generateHtml(
      "buyerPhone",
      buyerPhone
    );
    findByClass("buyerEmail").innerHTML += generateHtml(
      "buyerEmail",
      buyerEmail
    );
    const sellerDetails = invoiceData.company.seller;
    const sellerName = buyerDetails.name;
    const sellerAddress = buyerDetails.address;
    const sellerCode = buyerDetails.code;
    const sellerVat = buyerDetails.vat;
    const sellerPhone = buyerDetails.phone;
    const sellerEmail = buyerDetails.email;
    findByClass("sellerName").innerHTML += generateHtml(
      "sellerName",
      sellerName
    );
    findByClass("sellerAddress").innerHTML += generateHtml(
      "sellerAddress",
      sellerAddress
    );
    findByClass("sellerCode").innerHTML += generateHtml(
      "sellerCode",
      sellerCode
    );
    findByClass("sellerVat").innerHTML += generateHtml("sellerVat", sellerVat);
    findByClass("sellerPhone").innerHTML += generateHtml(
      "sellerPhone",
      sellerPhone
    );
    findByClass("sellerEmail").innerHTML += generateHtml(
      "sellerEmail",
      sellerEmail
    );
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();
