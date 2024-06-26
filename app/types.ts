export interface itemTypes {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  count: number;
}

export interface AddressRef {
  validateForm: () => Promise<boolean>;
  getAddressData: () => AddressData;
}

export interface AddressData {
  email: string;
  lastName: string;
  firstName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
  phoneNumber: string;
}
