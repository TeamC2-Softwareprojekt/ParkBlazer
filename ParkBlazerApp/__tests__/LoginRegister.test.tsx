import { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../src/App';
import { vi } from 'vitest';
import AuthService from '../src/AuthService';
import axios from 'axios';

let loginButton: HTMLElement | null = null;
let registerButton: HTMLElement | null = null;

beforeEach(async () => {
    await act( async () => {
        render( <App /> );
    });
    loginButton = document.getElementById('login-button');
    registerButton = document.getElementById('registration-button');
});

afterEach(async () => {
    history.pushState({}, 'Home', '/home');
});

test('Switching to Login screen', async () => {
    fireEvent.click(loginButton!);

    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test('Login with invalid email', async () => {
    fireEvent.click(loginButton!);
    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let loginSubmit = document.getElementById('login-submit');

    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
    });
    
    expect(loginSubmit?.getAttribute('disabled')).toBe("");
    expect(emailInput?.getAttribute('error-text')).toBe('Keine valide Email!');
});

test('Login with valid email', async () => {
    fireEvent.click(loginButton!);
    let loginSpy = vi.spyOn(AuthService, 'login');
    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let loginSubmit = document.getElementById('login-submit');
    
    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'e@mail.com', event: new InputEvent('input')}}));
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
    });
    
    expect(loginSubmit?.getAttribute('disabled')).toBe("false");
    expect(emailInput?.getAttribute('error-text')).toBe('');
    await act(async () => {
        fireEvent.click(loginSubmit!);
    });
    expect(loginSpy.mock.calls.length).toBe(1);
    
    let logoutButton = document.getElementById('logout-button');
    let logoutSpy = vi.spyOn(AuthService, 'logout');

    expect(logoutButton).toBeInTheDocument();
    await act(async () => {
        fireEvent.click(logoutButton!);
    });
    expect(document.getElementById('login-button')).toBeInTheDocument();
    expect(logoutSpy.mock.calls.length).toBe(1);
});

test('Switching to Register screen', async () => {
    fireEvent.click(registerButton!);
    let emailInput = document.getElementById('email-input');

    expect(emailInput).toBeInTheDocument();
});

test('Register with invalid email', async () => {
    fireEvent.click(registerButton!);
    let emailInput = document.getElementById('email-input');
    let registerSubmit = document.getElementById('register-submit');

    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
    });
    
    expect(registerSubmit?.getAttribute('disabled')).toBe("");
    expect(emailInput?.getAttribute('error-text')).toBe('Keine valide Email!');
});

test('Register with valid email', async () => {
    fireEvent.click(registerButton!);
    let emailInput = document.getElementById('email-input');
    
    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'e@mail.com', event: new InputEvent('input')}}));
    });

    expect(emailInput?.getAttribute('error-text')).toBe('');
});

test('Register with invalid password', async () => {
    fireEvent.click(registerButton!);
    let passwordInput = document.getElementById('password-input');
    let registerSubmit = document.getElementById('register-submit');

    await act(async () => {
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
    });

    expect(registerSubmit?.getAttribute('disabled')).toBe("");
    expect(passwordInput?.getAttribute('error-text')).toBe('Passwort muss länger als 10 Zeichen sein!');
});

test('Register with valid password', async () => {
    fireEvent.click(registerButton!);
    let passwordInput = document.getElementById('password-input');
    
    await act(async () => {
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: '12345678901', event: new InputEvent('input')}}));
    });

    expect(passwordInput?.getAttribute('error-text')).toBe('');
});

test('Register with invalid birthdate', async () => {
    fireEvent.click(registerButton!);
    let birthdateInput = document.getElementById('birthdate-input');
    let registerSubmit = document.getElementById('register-submit');

    await act(async () => {
        fireEvent(birthdateInput!, new CustomEvent('ionInput', {detail: {value: '2024-01-01', event: new InputEvent('input')}}));
    });

    expect(registerSubmit?.getAttribute('disabled')).toBe("");
    expect(birthdateInput?.getAttribute('error-text')).toBe('Keine 18 Jahre alt!');
});

test('Register with valid birthdate', async () => {
    fireEvent.click(registerButton!);
    let birthdateInput = document.getElementById('birthdate-input');
    
    await act(async () => {
        fireEvent(birthdateInput!, new CustomEvent('ionInput', {detail: {value: '2000-01-01', event: new InputEvent('input')}}));
    });

    expect(birthdateInput?.getAttribute('error-text')).toBe('');
});

test('Register with valid data', async () => {
    fireEvent.click(registerButton!);
    let registerSpy = vi.spyOn(axios, 'post');
    let usernameInput = document.getElementById('username-input');
    let firstnameInput = document.getElementById('firstname-input');
    let lastnameInput = document.getElementById('lastname-input');
    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let birthdateInput = document.getElementById('birthdate-input');
    let streetInput = document.getElementById('street-input');
    let houseNumberInput = document.getElementById('house-number-input');
    let zipInput = document.getElementById('zip-input');
    let cityInput = document.getElementById('city-input');
    let countryInput = document.getElementById('country-input');
    let registerSubmit = document.getElementById('register-submit');
    
    await act(async () => {
        fireEvent(usernameInput!, new CustomEvent('ionInput', {detail: {value: 'TestUser', event: new InputEvent('input')}}));
        fireEvent(firstnameInput!, new CustomEvent('ionInput', {detail: {value: 'Test', event: new InputEvent('input')}}));
        fireEvent(lastnameInput!, new CustomEvent('ionInput', {detail: {value: 'User', event: new InputEvent('input')}}));
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'e@mail.com', event: new InputEvent('input')}}));
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: '12345678901', event: new InputEvent('input')}}));
        fireEvent(birthdateInput!, new CustomEvent('ionInput', {detail: {value: '2000-01-01', event: new InputEvent('input')}}));
        fireEvent(streetInput!, new CustomEvent('ionInput', {detail: {value: 'Artilleriestraße', event: new InputEvent('input')}}));
        fireEvent(houseNumberInput!, new CustomEvent('ionInput', {detail: {value: '9', event: new InputEvent('input')}}));
        fireEvent(zipInput!, new CustomEvent('ionInput', {detail: {value: '32427', event: new InputEvent('input')}}));
        fireEvent(cityInput!, new CustomEvent('ionInput', {detail: {value: 'Minden', event: new InputEvent('input')}}));
        fireEvent(countryInput!, new CustomEvent('ionChange', {detail: {value: 'germany'}}));
    });

    expect(emailInput?.getAttribute('error-text')).toBe('');
    expect(registerSubmit?.getAttribute('disabled')).toBe("false");
    await act(async () => {
        fireEvent.click(registerSubmit!);
    });
    expect(document.getElementById('login-submit')).toBeInTheDocument();
    expect(registerSpy.mock.calls.length).toBe(1);
});