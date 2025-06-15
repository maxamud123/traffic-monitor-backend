// backend/simulate/mqttPublisher.ts
import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://broker.hivemq.com');

const roads = ['Kacyiru-Kigali Heights', 'Remera-Airtel', 'Nyamirambo'];

function publishSimulatedTraffic() {
  const payload = JSON.stringify({
    roadSegmentId: roads[Math.floor(Math.random() * roads.length)],
    timestamp: new Date(),
    vehicleCount: Math.floor(Math.random() * 100),
    averageSpeedKph: Math.floor(Math.random() * 60) + 20,
    congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  });

  client.publish('kigali/traffic', payload);
  console.log('📡 Published to MQTT:', payload);
}

client.on('connect', () => {
  console.log('MQTT Publisher connected');
  setInterval(publishSimulatedTraffic, 15000);
});
