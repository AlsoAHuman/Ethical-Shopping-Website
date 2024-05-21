const searchInput = document.getElementById("searchInput");
const mainContent = document.getElementById("mainContent");
let currentPage = 1;
const itemsPerPage = 10; // Adjust the number of items displayed per page

let scrapedItems = [];

async function performWebScraping() {
    try {
        const response = await fetch("https://example.com/shop"); // Replace with the actual shop URL
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const itemElements = doc.querySelectorAll(".item-container"); // Adjust the CSS selector as needed

        const items = [];
        itemElements.forEach(element => {
            const titleElement = element.querySelector(".item-title"); // Adjust the CSS selector as needed
            const priceElement = element.querySelector(".item-price"); // Adjust the CSS selector as needed
            const categoryElement = element.querySelector(".item-category"); // Adjust the CSS selector as needed

            if (titleElement && priceElement && categoryElement) {
                const title = titleElement.textContent.trim();
                const price = parseFloat(priceElement.textContent.replace(/\D/g, ""));
                const category = categoryElement.textContent.trim();
                items.push({ title, price, category });
            }
        });

        // Store the scraped items
        scrapedItems = items;

        displayItems();
    } catch (error) {
        console.error("Error during web scraping:", error);
    }
}

function displayItems() {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const displayedItems = scrapedItems.slice(startIndex, endIndex);

    displayedItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.innerHTML = `
            <h2>${item.title}</h2>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Category: ${item.category}</p>
        `;
        itemList.appendChild(itemElement);
    });

    // Display pagination controls
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(scrapedItems.length / itemsPerPage);

    if (totalPages > 1) {
        pagination.style.display = "block";

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayItems();
            });
            pagination.appendChild(pageButton);
        }
    } else {
        pagination.style.display = "none";
    }
}
