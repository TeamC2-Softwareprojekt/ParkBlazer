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
    const segment = useRef<HTMLIonSegmentElement>(null);
    const checkboxes = {
        checkboxBike: useRef<HTMLIonCheckboxElement>(null),
        checkboxCar: useRef<HTMLIonCheckboxElement>(null),
        checkboxTruck: useRef<HTMLIonCheckboxElement>(null)
    };
    const inputs = {
        inputPriceMin: useRef<HTMLIonInputElement>(null),
        inputPriceMax: useRef<HTMLIonInputElement>(null),
        inputSpaces: useRef<HTMLIonInputElement>(null),
        inputCity: useRef<HTMLIonInputElement>(null),
        inputRadius: useRef<HTMLIonInputElement>(null)
    };
    const inputCity = {
        label: "city",
        component: <IonInput ref={inputs.inputCity} class="filter-input clear" label="Stadt" type="text" placeholder="Stadt" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="text"/>
    };
    const inputRadius = {
        label: "radius",
        component: <IonInput ref={inputs.inputRadius} class="filter-input clear" label="Radius" type="number" placeholder="0km" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
    }
    const [showModal, setShowModal] = useState(false);
    const [searchMode, setSearchMode] = useState<any>(inputRadius);

    function switchSearchMode(event: any) {
        event.detail.value === "city" ? setSearchMode(inputCity) : setSearchMode(inputRadius);  
    }

    function clearFilter() {
        for (const key of Object.keys(inputs) as (keyof typeof inputs)[]) {
            const input = inputs[key].current;
            if (input) input.value = "";
        }

        for (const key of Object.keys(checkboxes) as (keyof typeof checkboxes)[]) {
            const checkbox = checkboxes[key].current;
            if (checkbox) checkbox.checked = false;
        }
    }

    function applyFilter() {
        let filterParams: FilterParams = {};

        filterParams.category = segment.current?.value;
        filterParams.type_bike = checkboxes.checkboxBike.current?.checked ? 1 : 0;
        filterParams.type_car = checkboxes.checkboxCar.current?.checked ? 1 : 0;
        filterParams.type_truck = checkboxes.checkboxTruck.current?.checked ? 1 : 0;
        filterParams.mode = { mode: searchMode.label, value: (inputs.inputCity.current?.value || inputs.inputRadius.current?.value) as string};
        filterParams.price = { min: parseInt(inputs.inputPriceMin.current?.value as string), max: parseInt(inputs.inputPriceMax.current?.value as string) };
        filterParams.minAvailableSpaces = parseInt(inputs.inputSpaces.current?.value as string);

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
                    <IonSegment id="filter-segment" ref={segment} value={'all'}>
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
                            <IonCheckbox ref={checkboxes.checkboxBike} className="filter-checkbox" labelPlacement="stacked">Fahrrad</IonCheckbox>
                            <IonCheckbox ref={checkboxes.checkboxCar} className="filter-checkbox" labelPlacement="stacked">PKW</IonCheckbox>
                            <IonCheckbox ref={checkboxes.checkboxTruck} className="filter-checkbox" labelPlacement="stacked">LKW</IonCheckbox>
                        </div>
                        <div id="filter-price-container">
                            <IonInput ref={inputs.inputPriceMin} class="filter-input clear" label="Minimum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                            <IonLabel>-</IonLabel>
                            <IonInput ref={inputs.inputPriceMax} class="filter-input clear" label="Maximum" type="number" placeholder="0€" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
                        </div>
                        <IonInput ref={inputs.inputSpaces} class="filter-input clear" label="Anzahl an Parkplätzen" type="number" placeholder="0" labelPlacement="stacked" fill="outline" clearOnEdit={true} inputMode="numeric" min={0}/>
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