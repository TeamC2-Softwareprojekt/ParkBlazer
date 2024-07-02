import { IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonText, IonContent } from "@ionic/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import AuthService from "../utils/AuthService";
import "./UserReports.css";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

const UserReports: React.FC = () => {
    const [reports, setReports] = useState<any>();

    useEffect(() => {
        fetchAvailabilityReports();
    }, []);

    const fetchAvailabilityReports = async () => {
        const token = AuthService.getToken();
        try {
            const response = await axios.get('https://server-y2mz.onrender.com/api/user_reports', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const reportsData = response.data;
            setReports(reportsData.reports);
        } catch (error) {
            console.error("Fehler beim Abrufen der Parkplatzverfügbarkeitsberichte:", error);
        }
    };


    return (
        <IonPage>
            <Navbar />
            <IonContent>
                <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                    <IonCol className="userreports-col" size="12" size-sm="12" size-md="12">
                        <IonText>
                            <h1 className="userreports-heading">Deine Meldungen</h1>
                        </IonText>
                        {reports && reports.map((report: any, index: any) => (
                            <IonCard key={index}>
                                <IonCardContent>
                                    <IonText><strong>Datum:</strong> {format(report.report_date, "dd.MM.yyyy hh:mm")} Uhr ({formatDistanceToNow(report.report_date, { addSuffix: true, locale: de })})</IonText>                                        <br />
                                    <IonText><strong>Grund:</strong> {report.report_type}</IonText>
                                    <br />
                                    <IonText><strong>Kommentar:</strong> {report.description}</IonText>
                                    <br />
                                    <IonText><strong>Status:</strong> {report.status}</IonText>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    );
};

export default UserReports;
