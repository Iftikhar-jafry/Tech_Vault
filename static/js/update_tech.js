//========================================================
//========================================================
//======== Update Technology Form Handling ==================
//========================================================
//========================================================


// Get the form
const technologyForm = document.getElementById("technologyForm");
const path=window.location.pathname;
const id=path.split("/").pop();
console.log("Technology ID:", id);

//========================================================
// Old Values in Form ====================================
//========================================================

// Fetch the existing technology data from the server
async function fetchTechnologyData(){
    try{
        const response = await fetch(`/technologies/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch technology data");
        }
        const technology = await response.json();

        // Populate the form fields with the existing data
        document.getElementById("technologyId").value = technology.id || "";
        document.getElementById("name").value = technology.name || "";
        document.getElementById("definition").value = technology.defination || "";
        document.getElementById("category").value = technology.category || "";
        document.getElementById("example").value = technology.examples || "";
        document.getElementById("use").value = technology.uses || "";
        document.getElementById("notes").value = technology.notes || "";
    }
    catch(error){
        console.error("Error fetching technology data:", error);
    }
}



//========================================================
// Form Submission Handling ==============================
//========================================================

technologyForm.addEventListener("submit", async function(event){
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

    try{
        // Send data to Flask
        const response = await fetch(`/technologies/${id}`,{
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error("Failed to update technology");
        }
        const result = await response.json();
        console.log("Technology updated successfully:", result);
        window.location.href ="/";
    }
    catch(error){
        console.error("Error updating technology:", error);
    }
})













document.addEventListener("DOMContentLoaded",fetchTechnologyData);