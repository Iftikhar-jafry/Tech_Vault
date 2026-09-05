let currentPage = 1;
let perPage = 10;


// ===============================
// Get technologies from Flask API
// ===============================
async function getTechnologies(page = 1) {

    const search = document.getElementById("searchInput").value.trim();

    try {

        let url = `/technologies?page=${page}&per_page=${perPage}`;

        // Add search only if user entered something
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch technologies");
        }

        const result = await response.json();

        console.log(result);

        // Display data
        displayTechnologies(result.data);

        // Update pagination
        updatePagination(result.pagination);

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("technologyDisplay").innerHTML =
            "<p>Unable to load technologies.</p>";
    }
}


// ===============================
// Display technologies
// ===============================
function displayTechnologies(technologies) {

    const container = document.getElementById("technologyDisplay");

    // Clear previous data
    container.innerHTML = "";

    // No results
    if (technologies.length === 0) {

        container.innerHTML = `
            <div class="technology">
                <h3>No technologies found</h3>
            </div>
        `;

        return;
    }


    // Create card for every technology
    technologies.forEach(tech => {

        const technologyDiv = document.createElement("div");

        technologyDiv.className = "technology";

        let html = `
            
            <h3>${escapeHTML(tech.name)}</h3>

            <div class="card">
                <strong>Definition:</strong>
                <p>${escapeHTML(tech.defination)}</p>
            </div>

            <div class="card even">
                <strong>Category:</strong>
                <p>${createList(tech.category)}</p>
            </div>
            `;
            

            // examples only create card if not empty
            if (tech.examples && tech.examples.trim()!==""){
                html +=`<div class="card">
                <strong>Example:</strong>
                <p>${createList(tech.examples)}</p>
            </div>
                `;
            }

            //uses only create card if not empty
            if (tech.uses && tech.uses.trim()!==""){
                html +=`<div class="card even">
                <strong>Uses:</strong>
                <p>${createList(tech.uses)}</p>
            </div>
                `;
            }
            
            // notes only create card if not empty
            if (tech.notes && tech.notes.trim()!=="")
            {
                html+=`<div class="card">
                <strong>Notes:</strong>
                <p>${createList(tech.notes)}</p>
            </div>
                `;
            }
            

           html+=` <span class="button-container">
            <button
                class="edit-button"
                type="button"
                data-id="${tech.id}"
                onclick="editTechnology(this)"
            >
                Edit
            </button>
            <button
                class="delete-button"
                type="button"
                data-id="${tech.id}"
                onclick="deleteTechnology(this)"
            >
                Delete
            </button>
            </span>
        `;
        technologyDiv.innerHTML = html;

        container.appendChild(technologyDiv);

    });
}


// ===============================
// Pagination
// ===============================
function updatePagination(pagination) {

    currentPage = pagination.page;

    document.getElementById("pageNumber").textContent =
        `Page ${pagination.page} of ${pagination.total_pages}`;


    document.getElementById("previousButton").disabled =
        !pagination.has_previous;


    document.getElementById("nextButton").disabled =
        !pagination.has_next;
}


// ===============================
// Previous page
// ===============================
function previousPage() {

    if (currentPage > 1) {

        getTechnologies(currentPage - 1);

    }
}


// ===============================
// Next page
// ===============================
function nextPage() {

    getTechnologies(currentPage + 1);

}


// ===============================
// Edit technology
// ===============================
function editTechnology(button) {

    const id = button.dataset.id;

    console.log("Technology ID:", id);

    window.location.href = `update-tech/${id}`;
}


// ===============================
// Delete technology
// ===============================
function deleteTechnology(button) {

    const id = button.dataset.id;

    console.log("Technology ID:", id);

    if (confirm("Are you sure you want to delete this technology?")) {

        fetch(`/technologies/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                // Remove the technology card from the DOM
                const technologyDiv = button.closest(".technology");
                technologyDiv.remove();
            } else {
                console.error("Failed to delete technology");
            }
        })
        .catch(error => {
            console.error("Error deleting technology:", error);
        });

    }
}


// ===============================
// Search
// ===============================
document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        currentPage = 1;

        getTechnologies(1);

    });


// ===============================
// Security helper
// ===============================
function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ===============================
// Create Lists if needed
// ===============================
function createList(text){
    if(!text){
        return "";
    }
    const items=text.split("\n").map(item=>item.trim()).filter(item=>item!=="")

    return `<ul>${items.map(item=>`<li>${escapeHTML(item)}</li>`).join("")}</ul>`
}


// ===============================
// Load technologies when page opens
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    getTechnologies(1);

});