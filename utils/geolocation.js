function calcularDistanciaEmKm(lat1, lon1, lat2, lon2) {
  const raioTerraKm = 6371; // Raio médio da Terra em quilômetros
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = raioTerraKm * c;
  return distancia;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  calcularDistanciaEmKm
};
