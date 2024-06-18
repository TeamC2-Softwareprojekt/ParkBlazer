let userLocation: { latitude: number, longitude: number } = { latitude: 0, longitude: 0 };
let updateInterval: NodeJS.Timeout;

export function getUserLocation() {
    return userLocation;
}

function setUserLocation(latitude: number, longitude: number) {
    userLocation.latitude = latitude;
    userLocation.longitude = longitude;
}

function findUserLocation() {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords.accuracy > 200) {
            console.error('The accuracy of the location is too low.');
            return;
        }
        setUserLocation(position.coords.latitude, position.coords.longitude);
    }, (error) => {
        console.error('Error getting user location', error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
};

export function startUserLocationUpdate() {
    if (!updateInterval) updateInterval = setInterval(findUserLocation, 10000);
}

export function stopUserLocationUpdate() {
    if (updateInterval) clearInterval(updateInterval);
}

findUserLocation();
startUserLocationUpdate();