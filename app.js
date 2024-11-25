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
    console.log(invoiceData.company.buyer.name);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
})();

console.log(invoiceData);
