/**
 * Function to generate HTML dynamically based on variable name.
 * @param {string} variableValue - The value of the variable.
 * @returns {string} - A string representing the HTML content.
 */
function generateHtml(className, variableValue) {
  return `<div class="${className}">${variableValue}</div>`;
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
    const buyerDetailsHtml = document.querySelector(".buyer_details");
    const invoiceData = await getData();
    const buyerDetails = invoiceData.company.buyer;
    const buyerName = buyerDetails.name;
    buyerDetailsHtml.innerHTML = generateHtml("buyerName", buyerName);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();
