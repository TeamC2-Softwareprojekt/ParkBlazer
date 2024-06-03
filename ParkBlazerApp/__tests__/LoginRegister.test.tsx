import { act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../src/App';
import { vi } from 'vitest';
import AuthService from '../src/AuthService';

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

    let error = undefined;
    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let loginSubmit = document.getElementById('login-submit');

    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
    });
    error = emailInput?.getAttribute('error-text');
    
    expect(loginSubmit?.getAttribute('disabled')).toBe("");
    expect(error).toBe('Keine valide Email!');
});

test('Login with valid email', async () => {
    fireEvent.click(loginButton!);
    let error = undefined;
    let spy = vi.spyOn(AuthService, 'login');
    let emailInput = document.getElementById('email-input');
    let passwordInput = document.getElementById('password-input');
    let loginSubmit = document.getElementById('login-submit');
    
    await act(async () => {
        fireEvent(emailInput!, new CustomEvent('ionInput', {detail: {value: 'e@mail.com', event: new InputEvent('input')}}));
        fireEvent(passwordInput!, new CustomEvent('ionInput', {detail: {value: 'test', event: new InputEvent('input')}}));
        fireEvent.click(loginSubmit!);
    });
    error = emailInput?.getAttribute('error-text');
    
    expect(error).toBe('');
    expect(loginSubmit?.getAttribute('disabled')).toBe("false");
    expect(spy.mock.calls.length).toBe(1);
});