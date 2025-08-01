export interface Party {
  id: string;
  displayName: string;
  role: 'owner' | 'holder' | 'swapper' | 'liquidityProvider' | 'admin';
}