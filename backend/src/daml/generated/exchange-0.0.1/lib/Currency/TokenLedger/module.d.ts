// Generated from Currency/TokenLedger.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Currency_TokenMetadata from '../../Currency/TokenMetadata/module';

export declare type Initialize = {
};

export declare const Initialize:
  damlTypes.Serializable<Initialize> & {
  }
;


export declare type TokenSetup = {
  owner: damlTypes.Party;
  initialSupply: damlTypes.Numeric;
  metadata: Currency_TokenMetadata.TokenMetadata;
  registryKey: damlTypes.Party;
};

export declare interface TokenSetupInterface {
  Archive: damlTypes.Choice<TokenSetup, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TokenSetup, undefined>>;
  Initialize: damlTypes.Choice<TokenSetup, Initialize, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<TokenMaster>, damlTypes.ContractId<TokenLedger>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<TokenSetup, undefined>>;
}
export declare const TokenSetup:
  damlTypes.Template<TokenSetup, undefined, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenSetup'> &
  damlTypes.ToInterface<TokenSetup, never> &
  TokenSetupInterface;

export declare namespace TokenSetup {
  export type CreateEvent = damlLedger.CreateEvent<TokenSetup, undefined, typeof TokenSetup.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenSetup, typeof TokenSetup.templateId>
  export type Event = damlLedger.Event<TokenSetup, undefined, typeof TokenSetup.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenSetup, undefined, typeof TokenSetup.templateId>
}



export declare type Cancel = {
};

export declare const Cancel:
  damlTypes.Serializable<Cancel> & {
  }
;


export declare type Reject = {
};

export declare const Reject:
  damlTypes.Serializable<Reject> & {
  }
;


export declare type Accept = {
};

export declare const Accept:
  damlTypes.Serializable<Accept> & {
  }
;


export declare type TokenTransferLock = {
  owner: damlTypes.Party;
  sender: damlTypes.Party;
  recipient: damlTypes.Party;
  amount: damlTypes.Numeric;
  symbol: string;
  metadata: Currency_TokenMetadata.TokenMetadata;
  registryKey: damlTypes.Party;
};

export declare interface TokenTransferLockInterface {
  Accept: damlTypes.Choice<TokenTransferLock, Accept, damlTypes.ContractId<TokenLedger>, TokenTransferLock.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenTransferLock, TokenTransferLock.Key>>;
  Reject: damlTypes.Choice<TokenTransferLock, Reject, damlTypes.ContractId<TokenTransferLock>, TokenTransferLock.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenTransferLock, TokenTransferLock.Key>>;
  Cancel: damlTypes.Choice<TokenTransferLock, Cancel, damlTypes.ContractId<TokenLedger>, TokenTransferLock.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenTransferLock, TokenTransferLock.Key>>;
  Archive: damlTypes.Choice<TokenTransferLock, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenTransferLock.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenTransferLock, TokenTransferLock.Key>>;
}
export declare const TokenTransferLock:
  damlTypes.Template<TokenTransferLock, TokenTransferLock.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenTransferLock'> &
  damlTypes.ToInterface<TokenTransferLock, never> &
  TokenTransferLockInterface;

export declare namespace TokenTransferLock {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<TokenTransferLock, TokenTransferLock.Key, typeof TokenTransferLock.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenTransferLock, typeof TokenTransferLock.templateId>
  export type Event = damlLedger.Event<TokenTransferLock, TokenTransferLock.Key, typeof TokenTransferLock.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenTransferLock, TokenTransferLock.Key, typeof TokenTransferLock.templateId>
}



export declare type Burn = {
  tokenCid: damlTypes.ContractId<TokenLedger>;
  amountToBurn: damlTypes.Optional<damlTypes.Numeric>;
};

export declare const Burn:
  damlTypes.Serializable<Burn> & {
  }
;


export declare type Mint = {
  amount: damlTypes.Numeric;
};

export declare const Mint:
  damlTypes.Serializable<Mint> & {
  }
;


export declare type TokenMaster = {
  owner: damlTypes.Party;
  totalSupply: damlTypes.Numeric;
  metadata: Currency_TokenMetadata.TokenMetadata;
  registryKey: damlTypes.Party;
};

export declare interface TokenMasterInterface {
  Mint: damlTypes.Choice<TokenMaster, Mint, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<TokenMaster>, damlTypes.ContractId<TokenLedger>>, TokenMaster.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenMaster, TokenMaster.Key>>;
  Burn: damlTypes.Choice<TokenMaster, Burn, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<TokenMaster>, damlTypes.Optional<damlTypes.ContractId<TokenLedger>>>, TokenMaster.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenMaster, TokenMaster.Key>>;
  Archive: damlTypes.Choice<TokenMaster, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenMaster.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenMaster, TokenMaster.Key>>;
}
export declare const TokenMaster:
  damlTypes.Template<TokenMaster, TokenMaster.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenMaster'> &
  damlTypes.ToInterface<TokenMaster, never> &
  TokenMasterInterface;

export declare namespace TokenMaster {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<TokenMaster, TokenMaster.Key, typeof TokenMaster.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenMaster, typeof TokenMaster.templateId>
  export type Event = damlLedger.Event<TokenMaster, TokenMaster.Key, typeof TokenMaster.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenMaster, TokenMaster.Key, typeof TokenMaster.templateId>
}



export declare type LockTokenForTransfer = {
  recipient: damlTypes.Party;
  transferAmount: damlTypes.Numeric;
};

export declare const LockTokenForTransfer:
  damlTypes.Serializable<LockTokenForTransfer> & {
  }
;


export declare type TokenLedger = {
  owner: damlTypes.Party;
  holder: damlTypes.Party;
  amount: damlTypes.Numeric;
  symbol: string;
  metadata: Currency_TokenMetadata.TokenMetadata;
  registryKey: damlTypes.Party;
};

export declare interface TokenLedgerInterface {
  LockTokenForTransfer: damlTypes.Choice<TokenLedger, LockTokenForTransfer, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<TokenTransferLock>, damlTypes.Optional<damlTypes.ContractId<TokenLedger>>>, TokenLedger.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenLedger, TokenLedger.Key>>;
  Archive: damlTypes.Choice<TokenLedger, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenLedger.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenLedger, TokenLedger.Key>>;
}
export declare const TokenLedger:
  damlTypes.Template<TokenLedger, TokenLedger.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenLedger'> &
  damlTypes.ToInterface<TokenLedger, never> &
  TokenLedgerInterface;

export declare namespace TokenLedger {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<TokenLedger, TokenLedger.Key, typeof TokenLedger.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenLedger, typeof TokenLedger.templateId>
  export type Event = damlLedger.Event<TokenLedger, TokenLedger.Key, typeof TokenLedger.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenLedger, TokenLedger.Key, typeof TokenLedger.templateId>
}


