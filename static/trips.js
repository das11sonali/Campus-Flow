document.getElementById("plan-btn").addEventListener("click", async () => {

    const destination = document.getElementById("destination").value;
    const budget = document.getElementById("budget").value;
    const days = document.getElementById("days").value;

    const resultDiv = document.getElementById("trip-result");

    const messages = [
    "👀 Stalking your destination...",
    "💸 Making your budget work overtime..",
    "🍜 Hunting for food that's actually worth it..",
    "📸 Keep an extra phone ready, your storage is about to suffer..",
    "✨ Hold on, we're cooking something special..",
    "✨ Your travel glow-up is loading......"
    ];

    let currentMessage = 0;

    resultDiv.innerHTML = `
        <div class="ai-loading">
            <p id="loading-text">${messages[0]}</p>
        </div>
    `;

    const loadingInterval = setInterval(() => {
        currentMessage = (currentMessage + 1) % messages.length;

        const loadingText = document.getElementById("loading-text");

        if (loadingText) {
            loadingText.textContent = messages[currentMessage];
        }
    }, 2500);

    try {

        const response = await fetch("/api/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination: destination,
                budget: budget,
                days: days
            })
        });

        const data = await response.json();
        clearInterval(loadingInterval);
        resultDiv.innerHTML = `
            <img src="${data.image}" class="trip-hero">
            ${data.itinerary}
        `;

    } catch (error) {
        
        clearInterval(loadingInterval);

        console.error(error);
        resultDiv.innerHTML = "Failed to generate trip plan.";

    }
});