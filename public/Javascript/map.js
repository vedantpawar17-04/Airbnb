const map = L.map('map').setView([18.6500, 73.7820],13);//Starting Position [lat,lng]
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
        })
    .addTo(map);
//const marker = L.marker([17.0854, 74.4218]).addTo(map);
//marker.bindPopup("<b>I Am A Standalone Popup</b><br>").openPopup();
