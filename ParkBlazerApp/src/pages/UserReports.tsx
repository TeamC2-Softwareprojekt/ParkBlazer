import { IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, IonText, IonContent } from "@ionic/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import AuthService from "../utils/AuthService";
import "./UserReports.css";
import { formatDistanceToNow } from "date-fns";
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
            console.log(reports)
        } catch (error) {
            console.error("Fehler beim Abrufen der Parkplatzverfügbarkeitsberichte:", error);
        }
    };


    return (
        <IonPage>
            <Navbar />
            <IonContent>
                <IonGrid fixed className="userreports-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                        <IonCol className="userreports-col" size="12" size-sm="12" size-md="12">
                            <IonText color="primary" className="register-title">
                                <h1 className="userreports-heading">Deine Meldungen</h1>
                            </IonText>
                            {reports && reports.map((report: any, index: any) => (
                                <IonCard key={index}>
                                    <IonCardContent>
                                        <IonText><strong>Datum:</strong> {report.report_date} {formatDistanceToNow(report.report_date, { addSuffix: true, locale: de })}</IonText>
                                        <br />
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
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default UserReports;
