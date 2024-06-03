import React, { useState } from "react";
import { IonButton, IonIcon, IonModal, IonHeader, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonInput, IonCheckbox, IonFooter, IonSelect, IonSelectOption } from "@ionic/react";
import { closeSharp } from "ionicons/icons";
import "./filter.css";

export default function Filter() {
    const [showModal, setShowModal] = useState(false);
    const [searchMode, setSearchMode] = useState<any>();

    function switchSearchMode(event: any) {
        console.log(event.detail.value);
        
        if (event.detail.value === "city")
            setSearchMode(<IonInput class="filter-input clear" label="Stadt" type="text" placeholder="Stadt" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="text"/>);
        else
            setSearchMode(<IonInput class="filter-input clear" label="Radius" type="number" placeholder="0km" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>);
    }

    function clearFilter() {
        const inputs = document.getElementsByClassName("clear") as HTMLCollectionOf<HTMLInputElement>;
        const checkboxes = document.getElementsByClassName("filter-checkbox") as HTMLCollectionOf<HTMLInputElement>;
                
        for (let input of inputs) {
            input.value = "";
        }

        for (let checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }

    return (
        <>
            <IonButton id="filter-button-open" onClick={() => setShowModal(true)}>
                <IonIcon src="src/icons/filter.svg"/>
            </IonButton>
            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <div id="filter-modal">
                    <IonHeader id="filter-header">
                            <IonTitle>Filter</IonTitle>
                            <IonButton id="filter-button-close" fill="clear" color="danger" onClick={() => setShowModal(false)}>
                                <IonIcon icon={closeSharp}/>
                            </IonButton>
                    </IonHeader>
                    <IonSegment class="filter-segment">
                        <IonSegmentButton value={"all"}>
                            <IonLabel>Alle</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={"public"}>
                            <IonLabel>Öffentlich</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={"private"}>
                            <IonLabel>Privat</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <div id="filter-input-container">
                        <div id="filter-checkbox-container">
                            <IonCheckbox className="filter-checkbox" labelPlacement="stacked">Fahrrad</IonCheckbox>
                            <IonCheckbox className="filter-checkbox" labelPlacement="stacked">PKW</IonCheckbox>
                            <IonCheckbox className="filter-checkbox" labelPlacement="stacked">LKW</IonCheckbox>
                        </div>
                        <div id="filter-price-container">
                            <IonInput class="filter-input clear" label="Minimum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                            <IonLabel>-</IonLabel>
                            <IonInput class="filter-input clear" label="Maximum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                        </div>
                        <IonInput class="filter-input clear" label="Anzahl an Parkplätzen" type="number" placeholder="0" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                        <div id="filter-mode">
                            <IonSelect id="filter-mode-select" class="filter-input" label="Filtern nach" placeholder="Radius" interface="popover" fill="outline" labelPlacement="stacked" onIonChange={(event) => switchSearchMode(event)}>
                              <IonSelectOption value="radius">Radius</IonSelectOption>
                              <IonSelectOption value="city">Stadt</IonSelectOption>
                            </IonSelect>
                            {searchMode}
                        </div>
                    </div>
                    <IonFooter id="filter-footer">
                        <IonButton id="filter-clear" onClick={clearFilter} fill="clear">Alle löschen</IonButton>
                        <IonButton>Anwenden</IonButton>
                    </IonFooter>
                </div>
            </IonModal>
        </>
    );
}