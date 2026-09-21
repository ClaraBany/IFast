export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Vehicle {
  id: number;
  model: string;
  color: string;
  plate: string | null;
  capacity: number | null;
}
