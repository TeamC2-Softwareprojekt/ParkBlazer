import axios from "axios";
import { parkingSpace } from "./parkingSpaces";
import AuthService from "../utils/AuthService";

export interface Report {
    description: string;
    parkingspot_id: number;
    report_date: string;
    report_id: number;
    report_type: string;
    status: string;
    user_id: number;
}

export interface AvailabilityReport {
    available_spaces: number;
    parking_availability_report_date: string;
    parking_availability_report_id: number;
    parkingspot_id: number;
    user_id: number;
}

export async function getAvailabilityReports(parkingspace: parkingSpace): Promise<AvailabilityReport[]> {
    let response;
    try {
        response = await axios.get(`https://server-y2mz.onrender.com/api/parking_availability_reports/${parkingspace.parkingspot_id}`);
    } catch (error) {
        console.error("Error while fetching availability reports", error);
        return [];
    }
    // Adjust dates to local timezone
    response.data.reports.map((report: AvailabilityReport) => {
        let date = new Date(report.parking_availability_report_date);
        date.setHours(date.getHours() - 2);
        report.parking_availability_report_date = date.toISOString();
    });
    return response?.data.reports;
}

export async function getCurrentUserReports(): Promise<Report[]> {
    let response;
    try {
        response = await axios.get('https://server-y2mz.onrender.com/api/user_reports', {
            headers: {
                Authorization: `Bearer ${AuthService.getToken()}`
            }
        });
    } catch (error) {
        console.error("Error while fetching user reports", error);
        return [];
    }
    // Adjust dates to local timezone
    response.data.reports.map((report: Report) => {
        let date = new Date(report.report_date);
        date.setHours(date.getHours() - 2);
        report.report_date = date.toISOString();
    });
    return response?.data.reports;
}

export async function createAvailabilityReport(parkingspace: parkingSpace, currentAvailability: number): Promise<boolean> {
    try {
        await axios.post('https://server-y2mz.onrender.com/api/insert_parking_availability_report',
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
        return false;
    }
    return true;
}

export async function createReport(parkingspace: parkingSpace, reportType: string, reportDescription: string): Promise<boolean> {
    try {
        await axios.post('https://server-y2mz.onrender.com/api/insert_parking_report',
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
        return false;
    }
    return true;
}