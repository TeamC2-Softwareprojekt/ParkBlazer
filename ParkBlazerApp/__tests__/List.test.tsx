import { Map } from '@maptiler/sdk';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import App from '../src/App';

test('Parkingspace List contains 3 items', async () => {
  await act(async () => {
    render(<App />);
  });
  let list = document.getElementById('parking-space-list');
  expect(list).toBeInTheDocument();
  expect(list!.children.length).toBe(3);
});

test("Clicking the first item", async () => {
  await act(async () => {
    render(<App />);
  });
  let spy = vi.spyOn(Map.prototype, 'flyTo');
  let list = document.getElementById('parking-space-list');
  let item = list!.children[0];
  fireEvent.click(item);
  expect(spy.mock.calls.length).toBe(1);
  expect(spy.mock.calls[0][0]).toEqual({ center: [8.906824111938477, 52.296695709228516], zoom: 18 });
});
