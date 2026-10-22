export const getLeafletHTML = (latitude, longitude, members) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', { zoomControl: false }).setView([${latitude}, ${longitude}], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // My location marker
    const myIcon = L.divIcon({
      className: '',
      html: '<div style="width:16px;height:16px;border-radius:50%;background:#0a8f7f;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker([${latitude}, ${longitude}], { icon: myIcon }).addTo(map);

    // Member markers
    const members = ${JSON.stringify(members)};
    const colors = ["#8e44ad","#e67e22","#c0392b","#2980b9"];
    members.forEach((m, i) => {
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:34px;height:34px;border-radius:50%;background:' + colors[i % colors.length] + ';border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:sans-serif;font-weight:bold;color:white;font-size:13px;line-height:34px;text-align:center;">' + m.initials + '</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      L.marker([m.lat, m.lng], { icon }).addTo(map);
    });
  </script>
</body>
</html>
`;