// Initialize the map
const map = L.map('map');
map.setView([-6.903, 107.6510], 13);

// Create basemaps
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
});

const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Add fullscreen control
map.addControl(new L.Control.Fullscreen());

// Home configuration (can be reused later if needed)
const home = {
    lat: -6.903,
    lng: 107.6510,
    zoom: 13
};

// Add "My Location" control
map.addControl(
    L.control.locate({
        locateOptions: {
            enableHighAccuracy: true
        }
    })
);

// Point symbology configuration
const symbologyPoint = {
    radius: 5,
    fillColor: "#9dfc03",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Layer: Jembatan PT
const jembatanPT = new L.LayerGroup();
$.getJSON("./asset/data-spasial/jembatan_pt.geojson", function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, symbologyPoint);
        }
    }).addTo(jembatanPT);
});
jembatanPT.addTo(map);

// Layer: Administrasi Kelurahan
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./asset/data-spasial/admin_kelurahan_ln.geojson", function (data) {
    L.geoJSON(data, {
        style: {
            color: "black",
            weight: 2,
            opacity: 1,
            dashArray: '3,3,20,3,20,3,20,3,20,3,20',
            lineJoin: 'round'
        }
    }).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

// Layer: Land Cover
const landcover = new L.LayerGroup();
$.getJSON("./asset/data-spasial/landcover_ar.geojson", function (data) {
    L.geoJSON(data, {
        style: function (feature) {
            switch (feature.properties.REMARK) {
                case 'Danau/Situ':
                case 'Empang':
                case 'Sungai':
                    return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Hutan Rimba':
                    return { fillColor: "#38A800", fillOpacity: 0.8, color: "#38A800" };
                case 'Perkebunan/Kebun':
                    return { fillColor: "#E9FFBE", fillOpacity: 0.8, color: "#E9FFBE" };
                case 'Permukiman dan Tempat Kegiatan':
                    return { fillColor: "#FFBEBE", fillOpacity: 0.8, weight: 0.5, color: "#FB0101" };
                case 'Sawah':
                    return { fillColor: "#01FBBB", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Semak Belukar':
                    return { fillColor: "#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#00A52F" };
                case 'Tanah Kosong/Gundul':
                    return { fillColor: "#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
                case 'Tegalan/Ladang':
                    return { fillColor: "#EDFF85", fillOpacity: 0.8, color: "#EDFF85" };
                case 'Vegetasi Non Budidaya Lainnya':
                    return { fillColor: "#000000", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan:</b> ' + feature.properties.REMARK);
        }
    }).addTo(landcover);
});

// Basemaps and overlay layers
const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "OSM HOT": osmHOT,
    "Google": baseMapGoogle
};

const overlayMaps = {
    "Jembatan": jembatanPT,
    "Batas Administrasi": adminKelurahanAR,
    "landcover_ar.geojson": landcover
};

// Add layer control
L.control.layers(baseMaps, overlayMaps).addTo(map);
// Batas Administrasi
adminKelurahanAR.addTo(map);

// Jembatan
jembatanPT.addTo(map);

// Tutupan Lahan
landcover.addTo(map);

