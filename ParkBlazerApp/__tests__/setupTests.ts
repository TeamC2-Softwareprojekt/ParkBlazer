import "@testing-library/jest-dom/extend-expect";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { createCanvas } from "canvas";
import gl from "gl";
import ResizeObserver from "resize-observer-polyfill";
import { afterEach, beforeAll, expect, vi } from "vitest";

expect.extend(matchers);
global.URL.createObjectURL = vi.fn();

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  window.HTMLCanvasElement.prototype.getContext = function (
    contextType: any): any {
    if (contextType === "webgl" || contextType === "experimental-webgl" || contextType === "webgl2") {
      const canvas = createCanvas(200, 200);
      return gl(canvas.width, canvas.height);
    }
    return createCanvas(200, 200).getContext(contextType);
  };
  global.ResizeObserver = ResizeObserver;
  global.caches = {
    open: vi.fn().mockResolvedValue({
      match: vi.fn().mockResolvedValue(null),
      add: vi.fn().mockResolvedValue(undefined),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(true),
    }),
    delete: vi.fn().mockResolvedValue(true),
    has: vi.fn().mockResolvedValue(true),
    keys: vi.fn().mockResolvedValue([]),
    match: vi.fn().mockResolvedValue(null),
  };
  global.Worker = class Worker {
    constructor(scriptURL: string | URL, options?: WorkerOptions) { }
    postMessage() { }
    addEventListener() { }
    removeEventListener() { }
    terminate() { }
    onmessage: any;
    onmessageerror: any;
    dispatchEvent: any;
    onerror: any;
  };
  mockSvgRequests();
  mockAxios();
  let varToSupressWarnings: any;
  varToSupressWarnings = vi.fn();
  global.ImageData = varToSupressWarnings;
  global.window = Object.create(window);
  Object.defineProperty(window, "location", {
    value: {
      reload: vi.fn(),
    },
  });
});

function mockSvgRequests() {
  const originalFetch = global.fetch;
  global.fetch = vi.fn((url) => {
    let urlString = "";
    if (typeof url === "string") {
      urlString = url;
    } else if (url instanceof URL) {
      urlString = url.href;
    } else if (url instanceof Request) {
      urlString = url.url;
    }

    if (urlString.endsWith(".svg")) {
      return Promise.resolve(new Response("<svg></svg>"));
    } else {
      return originalFetch(url);
    }
  });
}

function mockAxios() {
  vi.mock("axios", () => {
    return {
      default: {
        get: vi.fn(() => Promise.resolve({
          data: [
            {
              available_spaces: 12,
              city: "Minden",
              country: "Germany",
              description: "Hier können Sie an der FH in Minden parken!",
              house_number: "9",
              image_url: "url",
              latitude: 52.296695709228516,
              longitude: 8.906824111938477,
              name: "Parkplatz FH Minden",
              parkingspot_id: 1,
              street: "Artilleriestraße",
              type_bike: 0,
              type_car: 1,
              type_truck: 0,
              username: "TestUser",
              zip: "32427",
              distance: undefined,
            },
            {
              available_spaces: 30,
              city: "Löhne",
              country: "Germany",
              description: "Parkmöglichkeit in der Nähe der Bünder Straße 7",
              house_number: "7",
              image_url: "url",
              latitude: 52.200668,
              longitude: 8.66692,
              name: "Löhner Bahnhof Parkplatz",
              parkingspot_id: 2,
              street: "Bünder Straße",
              type_bike: 0,
              type_car: 1,
              type_truck: 1,
              username: "TestUser",
              zip: "32584",
              distance: undefined,
            },
            {
              available_spaces: 25,
              city: "Gütersloh",
              country: "Germany",
              description: "parkplatz",
              house_number: "58",
              image_url: "",
              latitude: 50.89696772909674,
              longitude: 5.377943299375099,
              name: "Versteckter Parkplatz an der Stadt Gütersloh",
              parkingspot_id: 3,
              street: "Neuenkirchener Straße",
              type_bike: 1,
              type_car: 1,
              type_truck: 0,
              username: "TestUser",
              zip: "32049",
              distance: undefined,
            },
          ],
        })
        ),
        post: vi.fn(() => Promise.resolve({ data: { token: "token" } })),
      },
    };
  });
}
