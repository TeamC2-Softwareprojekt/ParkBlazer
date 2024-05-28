import axios from 'axios';

export interface parkingSpace {
    available_spaces: number;
    city: string;
    country: string;
    description: string;
    house_number: string;
    image_url: string;
    latitude: number;
    longitude: number;
    name: string;
    parkingspot_id: number;
    street: string;
    type_bike: number;
    type_car: number;
    type_truck: number;
    username: string;
    zip: string;
    distance?: number;
}

export let parkingspaces: parkingSpace[] = [];
  
export async function initParkingSpaces() {
    let response = undefined;
    try {
            response = await axios.get('https://server-y2mz.onrender.com/api/get_parkingspots');
    } catch (error) {
            console.error('Error getting all Parkingspots', error);
    }
    parkingspaces = response?.data;
}

export function getNearestParkingSpaces(center:number[], maxDistance: number): parkingSpace[] {
    return parkingspaces.filter(p => {
        let distance = getDistanceInKm(p.latitude, p.longitude, center[1], center[0]) 
        p.distance = distance;
        return distance <= maxDistance;
    });
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
}
  
function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}
  