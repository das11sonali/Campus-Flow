navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // CREATE MAP
    const map = L.map('map').setView([lat, lng], 14);

    // MAP LAYER
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '© OpenStreetMap'
        }
    ).addTo(map);

    // USER LOCATION MARKER
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup("📍 We got you")
        .openPopup();

    // GEOAPIFY API KEY
    const apiKey = "b6f91640db3d48a4afefbcc99a9b2546";

    // API URL
    const url =
    `https://api.geoapify.com/v2/places?categories=catering.cafe,catering.restaurant,catering.fast_food&filter=circle:${lng},${lat},10000&limit=30&apiKey=${apiKey}`;

    // FETCH DATA
    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    // CARD CONTAINER
    const cafesContainer =
        document.getElementById("cafes-container");

    // LOOP THROUGH CAFES
    data.features.forEach(place => {

        const cafeLat = place.properties.lat;
        const cafeLng = place.properties.lon;

        const cafeName =
            place.properties.name || "Cafe";

        const address =
            place.properties.address_line2 ||
            "Address unavailable";

        // DISTANCE
        const distance =
            map.distance(
                [lat, lng],
                [cafeLat, cafeLng]
            );

        const distanceKm =
            (distance / 1000).toFixed(1);

        // MARKER
        const marker = L.marker([cafeLat, cafeLng])
            .addTo(map)
            .bindPopup(`
                <b>${cafeName}</b>
            `);

        // CARD
        const card = document.createElement("div");

        card.classList.add("cafe-card");
        const cafeImages = [

        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
        

        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?q=80&w=1200&auto=format&fit=crop"
        ];

    const randomImage =
        cafeImages[
            Math.floor(Math.random() * cafeImages.length)
        ];

        card.innerHTML = `

            <img
            src="${randomImage}"
            alt="Cafe Image">

            <div class="card-content">

                <h3>${cafeName}</h3>

                <p>📍 ${address}</p>

                <p>🚶 ${distanceKm} km away</p>

            </div>
        `;

        // CARD CLICK
        card.addEventListener("click", () => {

            map.setView([cafeLat, cafeLng], 17);

            marker.openPopup();

        });

        cafesContainer.appendChild(card);

    });

},
() => {

    alert("Please allow location access.");

});