import axios from 'axios';
import { FilterParams } from '../components/filter';

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
    if (parkingspaces.length > 0) return;

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

export function getFilteredParkingSpaces(filterParams: FilterParams): parkingSpace[] {
    return parkingspaces
        // TODO: parking space category (private, public, all) and price
        .filter(p => {
            if (!filterParams.mode?.value) return true;
            if (filterParams.mode?.mode === "city") {
                return p.city.toLowerCase().includes(filterParams.mode.value.toLowerCase());
            } else {
                return true;
                // TODO: implement getNearestParkingSpaces with user position
            }
        })
        .filter(p => {
            if (!filterParams.type_bike && !filterParams.type_car && !filterParams.type_truck) return true;
            return (filterParams.type_bike === 1 ? p.type_bike === 1 : true) &&
            (filterParams.type_car === 1 ? p.type_car === 1 : true) &&
            (filterParams.type_truck === 1 ? p.type_truck === 1 : true);
        })
        .filter(p => {
            if (!filterParams.minAvailableSpaces) return true;
            return p.available_spaces >= filterParams.minAvailableSpaces;
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
  