import axios from "axios";
import AuthService from "../utils/AuthService";
import { parkingSpace } from "./parkingSpaces";

export interface Reservation {
    availability_start_date: string;
    availability_end_date: string;
    start_date: string;
    end_date: string;
    timestamp: string;
    price_per_hour: number;
    reservation_id: number;
    email: string;
    username: string;
    status: string;
    private_parkingspot_id: number;
}

export async function getCurrentUserReservations(): Promise<Reservation[]> {
    let response;
    try {
        response = await axios.get('https://server-y2mz.onrender.com/api/user_reservations',
            {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            }
        );
    } catch (error: any) {
        console.error(error);
        return error;
    }
    return response?.data;
}

export async function getReservedDates(private_parkingspt_id: number): Promise<Reservation[]> {
    let response;
    try {
        response = await axios.get('https://server-y2mz.onrender.com/api/get_reservations/' + private_parkingspt_id);
    } catch (error: any) {
        console.error(error);
    }
    return response?.data;
}

export async function createReservation(start_date: Date, end_date: Date, parkingspace: parkingSpace, price: number, paymentMethod: string): Promise<Boolean> {
    try {
        await axios.post('https://server-y2mz.onrender.com/api/create_reservation',
            {
                start_date: start_date.toISOString(),
                end_date: end_date.toISOString(),
                private_parkingspot_id: parkingspace.private_parkingspot_id,
                amount: Number(price.toFixed(2)),
                payment_method: paymentMethod
            },
            {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            }
        );
    } catch (error: any) {
        console.error(error);
        return false;
    }
    return true;
}