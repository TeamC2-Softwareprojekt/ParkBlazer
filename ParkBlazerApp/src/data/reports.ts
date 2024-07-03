import axios from "axios";
import { parkingSpace } from "./parkingSpaces";
import AuthService from "../utils/AuthService";

export async function getAvailabilityReports(parkingspace: parkingSpace): Promise<any> {
    try {
        return await axios.get(`https://server-y2mz.onrender.com/api/parking_availability_reports/${parkingspace.parkingspot_id}`);
    } catch (error) {
        console.error("Error while fetching availability reports", error);
        return error;
    }
}

export async function getCurrentUserReports(): Promise<any> {
    try {
        return await axios.get('https://server-y2mz.onrender.com/api/user_reports', {
            headers: {
                Authorization: `Bearer ${AuthService.getToken()}`
            }
        });
    } catch (error) {
        console.error("Error while fetching user reports", error);
        return error;
    }
}

export async function createAvailabilityReport(parkingspace: parkingSpace, currentAvailability: number): Promise<any> {
    try {
        return await axios.post('https://server-y2mz.onrender.com/api/insert_parking_availability_report',
            {
                "parkingspot_id": parkingspace.parkingspot_id,
                "available_spaces": currentAvailability
            },
            {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            }
        );
    } catch (error) {
        console.error('Error while creating availability report', error);
        return error;
    }
}

export async function createReport(parkingspace: parkingSpace, reportType: number, reportDescription: string): Promise<any> {
    try {
        return await axios.post('https://server-y2mz.onrender.com/api/insert_parking_report',
            {
                "parkingspot_id": parkingspace.parkingspot_id,
                "report_type": reportType,
                "description": reportDescription
            },
            {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`
                }
            }
        );
    } catch (error) {
        console.error('Error while creating report:' + reportType, error);
        return error;
    }
}