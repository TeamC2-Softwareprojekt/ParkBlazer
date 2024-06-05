import { useRef, useState } from "react";
import { IonButton, IonIcon, IonModal, IonHeader, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonInput, IonCheckbox, IonFooter, IonSelect, IonSelectOption, SegmentValue } from "@ionic/react";
import { closeSharp } from "ionicons/icons";
import "./filter.css";

export interface FilterParams {
    [key: string]: any;
    category?: SegmentValue;
    mode?: { mode: string, value: string };
    type_bike?: number;
    type_car?: number;
    type_truck?: number;
    price?: { min: number, max: number };
    minAvailableSpaces?: number;
}

export default function Filter({onFilterApply}: {onFilterApply: any}) {
    const inputCity = {
        label: "city",
        component: <IonInput id="filter-input-city" class="filter-input clear" label="Stadt" type="text" placeholder="Stadt" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="text"/>
    };
    const inputRadius = {
        label: "radius",
        component: <IonInput id="filter-input-radius" class="filter-input clear" label="Radius" type="number" placeholder="0km" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
    }
    const [showModal, setShowModal] = useState(false);
    const [searchMode, setSearchMode] = useState<any>(inputRadius);

    function switchSearchMode(event: any) {
        event.detail.value === "city" ? setSearchMode(inputCity) : setSearchMode(inputRadius);  
    }

    function clearFilter() {
        //TODO: use refs instead of DOM manipulation
        const inputs = document.getElementsByClassName("clear") as HTMLCollectionOf<HTMLInputElement>;
        const checkboxes = document.getElementsByClassName("filter-checkbox") as HTMLCollectionOf<HTMLInputElement>;

        for (let input of inputs) {
            input.value = "";
        }

        for (let checkbox of checkboxes) {
            checkbox.checked = false;
        }
    }

    function applyFilter() {
        //TODO: use refs instead of DOM manipulation
        const segment = document.getElementById("filter-segment") as HTMLIonSegmentElement;
        const checkboxBike = document.getElementById("filter-checkbox-bike") as HTMLIonCheckboxElement;
        const checkboxCar = document.getElementById("filter-checkbox-car") as HTMLIonCheckboxElement;
        const checkboxTruck = document.getElementById("filter-checkbox-truck") as HTMLIonCheckboxElement;
        const priceMin = document.getElementById("filter-input-price-min") as HTMLInputElement;
        const priceMax = document.getElementById("filter-input-price-max") as HTMLInputElement;
        const spaces = document.getElementById("filter-input-spaces") as HTMLInputElement;
        const modeComponent = document.getElementById("filter-input-" + searchMode.label) as HTMLInputElement;

        let filterParams: FilterParams = {};

        filterParams.category = segment.value;
        filterParams.type_bike = checkboxBike.checked ? 1 : 0;
        filterParams.type_car = checkboxCar.checked ? 1 : 0;
        filterParams.type_truck = checkboxTruck.checked ? 1 : 0;
        filterParams.mode = { mode: searchMode.label, value: modeComponent.value };
        filterParams.price = { min: parseInt(priceMin.value), max: parseInt(priceMax.value) };
        filterParams.minAvailableSpaces = parseInt(spaces.value);

        onFilterApply(filterParams);
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
                    <IonSegment id="filter-segment" value={'all'}>
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
                            <IonCheckbox id="filter-checkbox-bike" className="filter-checkbox" labelPlacement="stacked">Fahrrad</IonCheckbox>
                            <IonCheckbox id="filter-checkbox-car" className="filter-checkbox" labelPlacement="stacked">PKW</IonCheckbox>
                            <IonCheckbox id="filter-checkbox-truck" className="filter-checkbox" labelPlacement="stacked">LKW</IonCheckbox>
                        </div>
                        <div id="filter-price-container">
                            <IonInput id="filter-input-price-min" class="filter-input clear" label="Minimum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                            <IonLabel>-</IonLabel>
                            <IonInput id="filter-input-price-max" class="filter-input clear" label="Maximum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                        </div>
                        <IonInput id="filter-input-spaces" class="filter-input clear" label="Anzahl an Parkplätzen" type="number" placeholder="0" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                        <div id="filter-mode">
                            <IonSelect id="filter-select-mode" class="filter-input" label="Filtern nach" placeholder={searchMode.component.props.label} interface="popover" fill="outline" labelPlacement="stacked" onIonChange={(event) => switchSearchMode(event)}>
                              <IonSelectOption value="radius">Radius</IonSelectOption>
                              <IonSelectOption value="city">Stadt</IonSelectOption>
                            </IonSelect>
                            {searchMode.component}
                        </div>
                    </div>
                    <IonFooter id="filter-footer">
                        <IonButton id="filter-clear" onClick={clearFilter} fill="clear">Alle löschen</IonButton>
                        <IonButton onClick={applyFilter}>Anwenden</IonButton>
                    </IonFooter>
                </div>
            </IonModal>
        </>
    );
}