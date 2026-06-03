document
.getElementById("add-subject")
.addEventListener("click", () => {

    const row = document.createElement("div");

    row.classList.add("subject-row");

    row.innerHTML = `
        <input
            type="text"
            class="subject"
            placeholder="Subject Name">

        <input
            type="date"
            class="deadline"
            placeholder="Finish by">
    `;

    document
    .getElementById("subjects-container")
    .appendChild(row);

});


document
.getElementById("generate-plan")
.addEventListener("click", async () => {

    const subjects = [];

    document
    .querySelectorAll(".subject-row")
    .forEach(row => {

        subjects.push({
            subject: row.querySelector(".subject").value,
            deadline: row.querySelector(".deadline").value
        });

    });

    const hours =
        document.getElementById("hours").value;

    const result =
        document.getElementById("result");

    result.innerHTML = `
        <div class="loading">
            🧠 Generating Study Plan...
        </div>
    `;

    try {

        const response = await fetch(
            "/planner",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    subjects,
                    hours
                })
            }
        );

        const data = await response.json();
        console.log(data);

        const days = data.plan.split("---");
        let html = `
            <h3>🧠 Your Study Plan</h3>

            <div class="plan-grid">
        `;

        days.forEach(day => {

            html += `
                <div class="day-card">
                    ${day.replace(/\n/g,"<br>")}
                </div>
            `;
        });

        html += "</div>";

        result.innerHTML = html;

    } catch(error){

        result.innerHTML = `
            <div class="error">
                Failed to generate plan.
            </div>
        `;

        console.error(error);
    }

});