export interface parkingSpace {
    id: number;
    adress: string;
    city: string;
    type_bike: boolean;
    type_car: boolean;
    type_truck: boolean;
    amount: number;
    private: boolean;
    price: number;
  }
  
  const parkingSpaces: parkingSpace[] = [
    {
      id: 0,
      adress: 'Artilleriestraße 9',
      city: '42427 Minden',
      type_bike: true,
      type_car: false,
      type_truck: false,
      amount: 4,
      private: false,
      price: 0
    },
    {
      id: 1,
      adress: 'Königstraße 1',
      city: '42427 Minden',
      type_bike: true,
      type_car: true,
      type_truck: false,
      amount: 2,
      private: false,
      price: 0
    },
    {
      id: 2,
      adress: 'Königstraße 2',
      city: '42427 Minden',
      type_bike: false,
      type_car: true,
      type_truck: true,
      amount: 1,
      private: true,
      price: 5
    },
    {
      id: 3,
      adress: 'Königstraße 3',
      city: '42427 Minden',
      type_bike: true,
      type_car: true,
      type_truck: true,
      amount: 1,
      private: false,
      price: 0
    },
    {
      id: 4,
      adress: 'Königstraße 4',
      city: '42427 Minden',
      type_bike: true,
      type_car: false,
      type_truck: true,
      amount: 1,
      private: true,
      price: 3
    },
    {
      id: 5,
      adress: 'Königstraße 5',
      city: '42427 Minden',
      type_bike: false,
      type_car: true,
      type_truck: false,
      amount: 1,
      private: false,
      price: 0
    },
    {
      id: 6,
      adress: 'Königstraße 6',
      city: '42427 Minden',
      type_bike: false,
      type_car: true,
      type_truck: false,
      amount: 5,
      private: true,
      price: 6
    },
    {
      id: 7,
      adress: 'Königstraße 7',
      city: '42427 Minden',
      type_bike: true,
      type_car: false,
      type_truck: false,
      amount: 1,
      private: false,
      price: 0
    }
  ];
  
  export const getParkingSpaces = () => parkingSpaces;
  
  export const getParkingSpace = (id: number) => parkingSpaces.find(m => m.id === id);
  