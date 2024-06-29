import axios from 'axios';
import { FilterParams } from '../components/filter';
import { getUserLocation } from './userLocation';
import AuthService from '../utils/AuthService';

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
    price_per_hour?: number;
    availability_start_date?: string;
    availability_end_date?: string;
    private_parkingspot_id?: number;
}

export let parkingspaces: parkingSpace[] = [];

export async function initParkingSpaces() {
    if (parkingspaces?.length > 0) return;

    let parkingspacesData = undefined;
    let private_parkingspaces = undefined;
    try {
        parkingspacesData = await axios.get('https://server-y2mz.onrender.com/api/get_parkingspots');
        private_parkingspaces = await axios.get('https://server-y2mz.onrender.com/api/get_privateparkingspots');
    } catch (error) {
        console.error('Error getting all Parkingspots', error);
    }

    parkingspacesData?.data.forEach((publicSpace: any) => {
        const privateSpace = private_parkingspaces?.data.find((p: any) => p.parkingspot_id === publicSpace.parkingspot_id);
        if (privateSpace) {
            Object.assign(publicSpace, privateSpace);
        }
    });

    parkingspaces = parkingspacesData?.data;
}

export function setDistancesToPoint(center: number[]) {
    parkingspaces.forEach(p => {
        p.distance = getDistanceInKm(p.latitude, p.longitude, center[0], center[1]);
    });
}

export function getNearestParkingSpaces(center: number[], maxDistance: number): parkingSpace[] {
    return parkingspaces.filter(p => {
        let distance = getDistanceInKm(p.latitude, p.longitude, center[0], center[1])
        p.distance = distance;
        return distance <= maxDistance;
    });
}

export function getFilteredParkingSpaces(filterParams: FilterParams): parkingSpace[] {
    let list = parkingspaces;
    if (filterParams.currentSearchCenter?.length) list = getNearestParkingSpaces(filterParams.currentSearchCenter, 50);

    return list
        // TODO: parking space category (private, public, all) and price
        .filter(p => {
            if (!filterParams.mode?.value) return true;
            if (filterParams.mode?.mode === "city") {
                return p.city.toLowerCase().includes(filterParams.mode.value.toLowerCase());
            } else {
                const userLocation = getUserLocation();
                if (!userLocation.latitude || !userLocation.longitude) return true;
                return getDistanceInKm(p.latitude, p.longitude, userLocation.latitude, userLocation.longitude) <= parseInt(filterParams.mode.value);
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

export async function getReservedDates(private_parkingspt_id: number): Promise<Date[][]> {
    if (!AuthService.isLoggedIn()) return Promise.resolve([]);
    let data;
    try {
        const response = await fetch('https://server-y2mz.onrender.com/api/user_reservations', {
            headers: {
            Authorization: `Bearer ${AuthService.getToken()}`
            },
        });
        if (response.ok) {
            data = await response.json();
        }
        else {
            console.error(await response.text());
        }
    } catch (error: any) {
        console.error(error);
    }

    return Promise.resolve(data?.filter((r: any) => r.private_parkingspot_id === private_parkingspt_id).map((r: any) => [new Date(r.start_date), new Date(r.end_date)]));
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}