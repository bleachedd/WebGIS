// Inisialisasi peta
const map = L.map('map').setView([-6.914744, 107.609810], 12); // Koordinat Bandung

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Contoh data kualitas udara
const airQualityData = [
  { lat: -6.914744, lon: 107.609810, aqi: 75, city: "Bandung" },
  { lat: -6.917464, lon: 107.619123, aqi: 90, city: "Bandung Utara" },
  { lat: -6.920123, lon: 107.599876, aqi: 60, city: "Bandung Selatan" }
];

// Tambahkan marker ke peta
airQualityData.forEach(location => {
  const marker = L.marker([location.lat, location.lon]).addTo(map);
  marker.bindPopup(`<b>${location.city}</b><br>AQI: ${location.aqi}`);
  marker.on('click', () => {
    updateChart(location.city);
    updatePrediction(location.aqi);
  });
});

// Inisialisasi Chart.js
const ctx = document.getElementById('aqiChart').getContext('2d');
let aqiChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    datasets: [{
      label: 'AQI',
      data: [70, 65, 80, 75, 90, 85, 60],
      borderColor: 'var(--accent-color)',
      backgroundColor: 'rgba(0,123,255,0.1)',
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-color)'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--text-color)'
        }
      },
      y: {
        ticks: {
          color: 'var(--text-color)'
        }
      }
    }
  }
});

// Fungsi untuk memperbarui grafik
function updateChart(city) {
  // Simulasi data baru
  const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  aqiChart.data.datasets[0].data = newData;
  aqiChart.update();
}

// Fungsi prediksi AI sederhana
function updatePrediction(currentAqi) {
  let prediction = '';
  if (currentAqi <= 50) {
    prediction = 'Baik';
  } else if (currentAqi <= 100) {
    prediction = 'Sedang';
  } else if (currentAqi <= 150) {
    prediction = 'Tidak Sehat bagi Kelompok Sensitif';
  } else if (currentAqi <= 200) {
    prediction = 'Tidak Sehat';
  } else if (currentAqi <= 300) {
    prediction = 'Sangat Tidak Sehat';
  } else {
    prediction = 'Berbahaya';
  }
  document.getElementById('prediction-result').textContent = `Prediksi: ${prediction}`;
}

// Toggle dark/light mode
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
