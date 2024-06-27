import { IonPage, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonThumbnail, IonLabel, IonText } from "@ionic/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import AuthService from "../utils/AuthService";
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
            <IonGrid fixed className="userreports-grid">
                <IonRow className="ion-justify-content-center ion-align-items-center full-height">
                    <IonCol className="userreports-col" size="12" size-sm="12" size-md="12">
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Deine Parkplatz-Meldungen</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonList>
                                    {reports && reports.map((report: any, index: any) => (
                                        <IonItem key={index}>
                                            <IonText>{report.report_type}</IonText>
                                            <IonText>{report.description}</IonText>
                                            <IonText>{report.status}</IonText>
                                            <IonText>{report.report_date} {formatDistanceToNow(report.report_date, { addSuffix: true, locale: de })}</IonText>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};

export default UserReports;
