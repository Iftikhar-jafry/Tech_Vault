//========================================================
//========================================================
//======== Add Technology Form Handling ==================
//========================================================
//========================================================


// Get the form
const technologyForm = document.getElementById("technologyForm");


// Submit form
technologyForm.addEventListener("submit", async function (event) {

    // Prevent normal form submission
    event.preventDefault();


    // Get values from form
    const name = document.getElementById("name").value.trim();
    const definition = document.getElementById("definition").value.trim();
    const category = document.getElementById("category").value.trim();
    const example = document.getElementById("example").value.trim();
    const use = document.getElementById("use").value.trim();
    const notes = document.getElementById("notes").value.trim();


    // Create data object
    const data = {
        name: name,
        category: category,
        defination: definition,
        examples: example,
        uses: use,
        notes: notes
    };


    console.log("Data being sent:", data);


    try {

        // Send data to Flask
        const response = await fetch("/technologies", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });


        // Convert Flask response to JSON
        const result = await response.json();


        console.log("Flask response:", result);


        // Check response
        if (response.ok) {

            alert(result.message);

            // Go back to home page
            window.location.href = "/";

        } else {

            alert(result.message || "Failed to add technology.");

        }


    } catch (error) {

        console.error("Error:", error);

        alert("Something went wrong. Please try again.");

    }

});
