const { calculateDistance } = require('./distanceCalculator');

const currentLocation = {
  latitude: 13.072661760546024,
  longitude: 77.50727310294697
};

const collegeLocation = {
  latitude: 13.072204074042398,
  longitude: 77.50754474895987
};

const { distanceInMeters, isWithinRange } = calculateDistance(
  currentLocation.latitude,
  currentLocation.longitude,
  collegeLocation.latitude,
  collegeLocation.longitude
);

console.log(`Distance: ${distanceInMeters.toFixed(2)} meters`);
console.log(`Within 500m Range: ${isWithinRange}`);
