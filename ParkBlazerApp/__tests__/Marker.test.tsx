import { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../src/App';
import { vi } from 'vitest';
import { Marker } from '@maptiler/sdk';

test('Marker are added to the map', async () => {
    let markerSpy = vi.spyOn(Marker.prototype, 'addTo');
    await act( async () => {
        render(<App />);
    });

    expect(markerSpy.mock.calls.length).toBe(3);
});

test('Open Marker Menu', async () => {
    await act( async () => {
        render(<App />);
    });
    let markerModalButton = document.getElementById('create-marker-modal-button');
    let createWithCoordinatesButton = document.getElementById('create-marker-with-coordinates');
    expect(createWithCoordinatesButton).not.toBeInTheDocument();
    
    await act(async () => {
        fireEvent.click(markerModalButton!);
    });
    createWithCoordinatesButton = document.getElementById('create-marker-with-coordinates');
    expect(createWithCoordinatesButton).toBeInTheDocument();
    
    await act(async () => {
        fireEvent.click(createWithCoordinatesButton!);
    });
    expect(document.getElementById('latitude-input')).toBeInTheDocument();
});

test('Creating a Marker using wrong data', async () => {
    await act( async () => {
        render(<App />);
    });
    await act(async () => {
        fireEvent.click(document.getElementById('create-marker-modal-button')!);
    });
    await act(async () => {
        fireEvent.click(document.getElementById('create-marker-with-coordinates')!);
    });

    let latitudeInput = document.getElementById('latitude-input');
    let longitudeInput = document.getElementById('longitude-input');
    let markerSubmitButton = document.getElementById('marker-submit');

    await act(async () => {
        fireEvent(latitudeInput!, new CustomEvent('ionChange', {detail: {value: '-90', event: new Event('change')}}));
        fireEvent(longitudeInput!, new CustomEvent('ionChange', {detail: {value: '-180', event: new Event('change')}}));
    });
    await act(async () => {
        fireEvent.click(markerSubmitButton!);
    });
    expect(document.getElementById('error-latitude-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-longitude-input')).not.toBeInTheDocument();

    await act(async () => {
        fireEvent(latitudeInput!, new CustomEvent('ionChange', {detail: {value: '90', event: new Event('change')}}));
        fireEvent(longitudeInput!, new CustomEvent('ionChange', {detail: {value: '180', event: new Event('change')}}));
    });
    await act(async () => {
        fireEvent.click(markerSubmitButton!);
    });  
    expect(document.getElementById('error-latitude-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-longitude-input')).not.toBeInTheDocument();

    await act(async () => {
        fireEvent(latitudeInput!, new CustomEvent('ionChange', {detail: {value: '100', event: new Event('change')}}));
        fireEvent(longitudeInput!, new CustomEvent('ionChange', {detail: {value: '200', event: new Event('change')}}));
    });
    await act(async () => {
        fireEvent.click(markerSubmitButton!);
    });   
    expect(document.getElementById('error-latitude-input')).toBeInTheDocument();
    expect(document.getElementById('error-longitude-input')).toBeInTheDocument();
    
    expect(document.getElementById('error-title-input')).toBeInTheDocument();
    expect(document.getElementById('error-description-input')).toBeInTheDocument();
    expect(document.getElementById('error-available-spaces-input')).toBeInTheDocument();
    expect(document.getElementById('error-street-input')).toBeInTheDocument();
    expect(document.getElementById('error-house-number-input')).toBeInTheDocument();
    expect(document.getElementById('error-zip-input')).toBeInTheDocument();
    expect(document.getElementById('error-city-input')).toBeInTheDocument();
    expect(document.getElementById('error-country-input')).toBeInTheDocument();
});

test('Create Marker by entering coordinates', async () => {
    await act( async () => {
        render(<App />);
    });
    let markerModalButton = document.getElementById('create-marker-modal-button');
    await act(async () => {
        fireEvent.click(markerModalButton!);
    });
    await act(async () => {
        fireEvent.click(document.getElementById('create-marker-with-coordinates')!);
    });
    
    let latitudeInput = document.getElementById('latitude-input');
    let longitudeInput = document.getElementById('longitude-input');
    let titleInput = document.getElementById('title-input');
    let descriptionInput = document.getElementById('description-input');
    let availableSpacesInput = document.getElementById('available-spaces-input');
    let streetInput = document.getElementById('street-input');
    let houseNumberInput = document.getElementById('house-number-input');
    let zipInput = document.getElementById('zip-input');
    let cityInput = document.getElementById('city-input');
    let countryInput = document.getElementById('country-input');
    let markerSubmitButton = document.getElementById('marker-submit');

    await act(async () => {
        fireEvent(latitudeInput!, new CustomEvent('ionChange', {detail: {value: '-100', event: new Event('change')}}));
        fireEvent(longitudeInput!, new CustomEvent('ionChange', {detail: {value: '-200', event: new Event('change')}}));
        fireEvent(titleInput!, new CustomEvent('ionChange', {detail: {value: 'TestTitle', event: new Event('change')}}));
        fireEvent(descriptionInput!, new CustomEvent('ionChange', {detail: {value: 'TestDescription', event: new Event('change')}}));
        fireEvent(availableSpacesInput!, new CustomEvent('ionChange', {detail: {value: '10', event: new Event('change')}}));
        fireEvent(streetInput!, new CustomEvent('ionChange', {detail: {value: 'TestStreet', event: new Event('change')}}));
        fireEvent(houseNumberInput!, new CustomEvent('ionChange', {detail: {value: '1', event: new Event('change')}}));
        fireEvent(zipInput!, new CustomEvent('ionChange', {detail: {value: '12345', event: new Event('change')}}));
        fireEvent(cityInput!, new CustomEvent('ionChange', {detail: {value: 'TestCity', event: new Event('change')}}));
        fireEvent(countryInput!, new CustomEvent('ionChange', {detail: {value: 'TestCountry', event: new Event('change')}}));
    });
    await act(async () => {
        fireEvent.click(markerSubmitButton!);
    });  

    expect(document.getElementById('error-title-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-description-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-available-spaces-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-street-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-house-number-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-zip-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-city-input')).not.toBeInTheDocument();
    expect(document.getElementById('error-country-input')).not.toBeInTheDocument(); 
});