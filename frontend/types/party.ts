export interface Party {
  id: string;
  displayName: string;
  role: 'owner' | 'holder' | 'swapper' | 'liquidityProvider' | 'admin';
}

export const mockParties: Party[] = [
  { id: 'Alice', displayName: 'Alice', role: 'owner' },
  { id: 'Bob', displayName: 'Bob', role: 'holder' },
  { id: 'Charlie', displayName: 'Charlie', role: 'swapper' },
  { id: 'Dave', displayName: 'Dave', role: 'liquidityProvider' },
  { id: 'Admin', displayName: 'Admin', role: 'admin' },
];
