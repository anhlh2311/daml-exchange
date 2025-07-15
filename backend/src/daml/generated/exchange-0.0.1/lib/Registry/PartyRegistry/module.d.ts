// Generated from Registry/PartyRegistry.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type IsPartyRegistered = {
  party: damlTypes.Party;
  requester: damlTypes.Party;
};

export declare const IsPartyRegistered:
  damlTypes.Serializable<IsPartyRegistered> & {
  }
;


export declare type ListParties = {
};

export declare const ListParties:
  damlTypes.Serializable<ListParties> & {
  }
;


export declare type UnregisterParty = {
  partyToRemove: damlTypes.Party;
};

export declare const UnregisterParty:
  damlTypes.Serializable<UnregisterParty> & {
  }
;


export declare type RegisterParty = {
  newParty: damlTypes.Party;
};

export declare const RegisterParty:
  damlTypes.Serializable<RegisterParty> & {
  }
;


export declare type PartyRegistry = {
  admin: damlTypes.Party;
  registeredParties: damlTypes.Party[];
};

export declare interface PartyRegistryInterface {
  RegisterParty: damlTypes.Choice<PartyRegistry, RegisterParty, damlTypes.ContractId<PartyRegistry>, PartyRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<PartyRegistry, PartyRegistry.Key>>;
  UnregisterParty: damlTypes.Choice<PartyRegistry, UnregisterParty, damlTypes.ContractId<PartyRegistry>, PartyRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<PartyRegistry, PartyRegistry.Key>>;
  ListParties: damlTypes.Choice<PartyRegistry, ListParties, damlTypes.Party[], PartyRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<PartyRegistry, PartyRegistry.Key>>;
  Archive: damlTypes.Choice<PartyRegistry, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, PartyRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<PartyRegistry, PartyRegistry.Key>>;
  IsPartyRegistered: damlTypes.Choice<PartyRegistry, IsPartyRegistered, boolean, PartyRegistry.Key> & damlTypes.ChoiceFrom<damlTypes.Template<PartyRegistry, PartyRegistry.Key>>;
}
export declare const PartyRegistry:
  damlTypes.Template<PartyRegistry, PartyRegistry.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Registry.PartyRegistry:PartyRegistry'> &
  damlTypes.ToInterface<PartyRegistry, never> &
  PartyRegistryInterface;

export declare namespace PartyRegistry {
  export type Key = damlTypes.Party
  export type CreateEvent = damlLedger.CreateEvent<PartyRegistry, PartyRegistry.Key, typeof PartyRegistry.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PartyRegistry, typeof PartyRegistry.templateId>
  export type Event = damlLedger.Event<PartyRegistry, PartyRegistry.Key, typeof PartyRegistry.templateId>
  export type QueryResult = damlLedger.QueryResult<PartyRegistry, PartyRegistry.Key, typeof PartyRegistry.templateId>
}


