import { render } from '@testing-library/react';
import { act } from 'react';
import App from '../src/App';

test('App renders', async () => {
  render(<App />);
});

test('Map renders', async () => {
  await act(async () => {
    render(<App />);
  });
  let map = document.getElementsByClassName('map maplibregl-map');
  expect(map.length).toBe(1);
  expect(map[0]).toBeInTheDocument();
});

test('Marker Menu renders', async () => {
  await act(async () => {
    render(<App />);
  });
  let markerMenu = document.getElementById('marker-menu');
  expect(markerMenu).toBeInTheDocument();
});

test('Parkingspace List renders', async () => {
  await act(async () => {
    render(<App />);
  });
  let list = document.getElementById('parking-space-list');
  expect(list).toBeInTheDocument();
});
