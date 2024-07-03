import { IonPage, IonCard, IonCardContent, IonText, IonContent } from "@ionic/react";
import Navbar from "../components/navbar";
import { useState } from "react";
import { useEffect } from "react";
import "./UserReports.css";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { getCurrentUserReports } from "../data/reports";

const UserReports: React.FC = () => {
  const [reports, setReports] = useState<any>();

  useEffect(() => {
    const fetchAvailabilityReports = async () => {
      const response = await getCurrentUserReports();
      if (response.status === 200) {
        setReports(response.data.reports);
      } else {
        setReports([]);
      }
    };

    fetchAvailabilityReports();
  }, []);

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <h1 className="userreports-heading">Deine Meldungen</h1>
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
      </IonContent>
    </IonPage>
  );
};

export default UserReports;
