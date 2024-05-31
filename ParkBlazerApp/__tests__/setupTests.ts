import '@testing-library/jest-dom/extend-expect';
import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";
import { createCanvas } from 'canvas';
import gl from 'gl';
import ResizeObserver from 'resize-observer-polyfill';

expect.extend(matchers);
global.URL.createObjectURL = vi.fn();

afterEach(() => {
  cleanup();
});

beforeAll(() => {
    window.HTMLCanvasElement.prototype.getContext = function (contextType: any): any {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
            const canvas = createCanvas(200, 200);
            return gl(canvas.width, canvas.height);
        }
            return createCanvas(200, 200).getContext(contextType);
    };
    global.ResizeObserver = ResizeObserver;
    global.Worker = class Worker {
        constructor(scriptURL: string | URL, options?: WorkerOptions) {
        }
        postMessage() {
        }
        addEventListener() {
        }
        removeEventListener() {
        }
        terminate() {
        }
        onmessage: any;
        onmessageerror: any;
        dispatchEvent: any;
        onerror: any;
    };
    mockSvgRequests();
    mockAxios();
});

function mockSvgRequests() {
    const originalFetch = global.fetch;
    global.fetch = vi.fn((url) => {
        let urlString = '';
        if (typeof url === 'string') {
          urlString = url;
        } else if (url instanceof URL) {
          urlString = url.href;
        } else if (url instanceof Request) {
          urlString = url.url;
        }

        if (urlString.endsWith('.svg')) {
          return Promise.resolve(new Response('<svg></svg>'));
        } else {
            return originalFetch(url);
        }
    });
}

function mockAxios() {
    vi.mock('axios', () => {
      return {
          default: {
        get: vi.fn(() => Promise.resolve({ data: [{
          available_spaces: 1,
          city: 'Berlin',
          country: 'Germany',
          description: 'Parkplatz in Berlin',
          house_number: '1',
          image_url: 'url',
          latitude: 52.5200,
          longitude: 13.4050,
          name: 'Parkplatz Berlin',
          parkingspot_id: 1,
          street: 'Street',
          type_bike: 1,
          type_car: 1,
          type_truck: 1,
          username: 'User',
          zip: '12345',
          distance: undefined
        }] }))
      }};
    });
}