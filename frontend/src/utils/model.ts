import { Role } from "stores/authStore";

export type Party = {
  identifier: string;
  displayName: string;
  role?: Role;
  isLocal?: boolean;
};
export interface Metadata {
  name: string;
  symbol: string;
  decimals: string;
  description: string;
  issuedDate: string;
  version?: string;
}

export interface TokenPayload {
  owner: string;
  holder: string;
  amount: string;
  symbol: string;
  metadata: Metadata;
  registryKey: string;
}

export interface TokenCardProps {
  payload: TokenPayload;
  contractId: string;
  templateId: string;
  signatories: string[];
  observers: string[];
}
export interface System {
  value: number | string;
  label: string;
}
