import axios from 'axios';

const SIMULATED_ROADS = ['RDB-Kimihurura', 'Kacyiru-Kigali Heights', 'Remera-Airtel'];

function getRandomLevel(): 'low' | 'medium' | 'high' {
  const levels = ['low', 'medium', 'high'];
  return levels[Math.floor(Math.random() * levels.length)] as 'low' | 'medium' | 'high';
}

function simulateSensorData() {
  const payload = {
    roadSegmentId: SIMULATED_ROADS[Math.floor(Math.random() * SIMULATED_ROADS.length)],
    timestamp: new Date(),
    vehicleCount: Math.floor(Math.random() * 100),
    averageSpeedKph: Math.floor(Math.random() * 60) + 20,
    congestionLevel: getRandomLevel(),
  };

  axios.post('http://localhost:5000/api/traffic', payload)
    .then(() => console.log('🚗 Simulated data sent:', payload))
    .catch(err => console.error('❌ Failed to send data:', err.message));
}

setInterval(simulateSensorData, 10000);