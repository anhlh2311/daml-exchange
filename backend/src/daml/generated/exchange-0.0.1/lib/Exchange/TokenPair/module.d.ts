// Generated from Exchange/TokenPair.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Exchange_TokenPairData from '../../Exchange/TokenPairData/module';

export declare type CreateTokenPair = {
  sellingPrice: damlTypes.Numeric;
  buyingPrice: damlTypes.Numeric;
};

export declare const CreateTokenPair:
  damlTypes.Serializable<CreateTokenPair> & {
  }
;


export declare type TokenPairSetup = {
  admin: damlTypes.Party;
  liquidityProvider: damlTypes.Party;
  inputListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>;
  quoteListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>;
  registryKey: damlTypes.Party;
};

export declare interface TokenPairSetupInterface {
  Archive: damlTypes.Choice<TokenPairSetup, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenPairSetup.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPairSetup, TokenPairSetup.Key>>;
  CreateTokenPair: damlTypes.Choice<TokenPairSetup, CreateTokenPair, damlTypes.ContractId<TokenPair>, TokenPairSetup.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPairSetup, TokenPairSetup.Key>>;
}
export declare const TokenPairSetup:
  damlTypes.Template<TokenPairSetup, TokenPairSetup.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPair:TokenPairSetup'> &
  damlTypes.ToInterface<TokenPairSetup, never> &
  TokenPairSetupInterface;

export declare namespace TokenPairSetup {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>>
  export type CreateEvent = damlLedger.CreateEvent<TokenPairSetup, TokenPairSetup.Key, typeof TokenPairSetup.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenPairSetup, typeof TokenPairSetup.templateId>
  export type Event = damlLedger.Event<TokenPairSetup, TokenPairSetup.Key, typeof TokenPairSetup.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenPairSetup, TokenPairSetup.Key, typeof TokenPairSetup.templateId>
}



export declare type RemoveTokenPair = {
};

export declare const RemoveTokenPair:
  damlTypes.Serializable<RemoveTokenPair> & {
  }
;


export declare type UpdateTokenPairObservers = {
};

export declare const UpdateTokenPairObservers:
  damlTypes.Serializable<UpdateTokenPairObservers> & {
  }
;


export declare type SetRate = {
  newSellingPrice: damlTypes.Numeric;
  newBuyingPrice: damlTypes.Numeric;
};

export declare const SetRate:
  damlTypes.Serializable<SetRate> & {
  }
;


export declare type GetData = {
};

export declare const GetData:
  damlTypes.Serializable<GetData> & {
  }
;


export declare type GetLiquidityProvider = {
};

export declare const GetLiquidityProvider:
  damlTypes.Serializable<GetLiquidityProvider> & {
  }
;


export declare type GetRate = {
  requester: damlTypes.Party;
};

export declare const GetRate:
  damlTypes.Serializable<GetRate> & {
  }
;


export declare type TokenPair = {
  admin: damlTypes.Party;
  liquidityProvider: damlTypes.Party;
  inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  sellingPrice: damlTypes.Numeric;
  buyingPrice: damlTypes.Numeric;
  registryKey: damlTypes.Party;
  observers: damlTypes.Party[];
};

export declare interface TokenPairInterface {
  GetRate: damlTypes.Choice<TokenPair, GetRate, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Numeric, damlTypes.Numeric>, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  GetLiquidityProvider: damlTypes.Choice<TokenPair, GetLiquidityProvider, damlTypes.Party, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  GetData: damlTypes.Choice<TokenPair, GetData, Exchange_TokenPairData.TokenPairData, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  SetRate: damlTypes.Choice<TokenPair, SetRate, damlTypes.ContractId<TokenPair>, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  UpdateTokenPairObservers: damlTypes.Choice<TokenPair, UpdateTokenPairObservers, damlTypes.ContractId<TokenPair>, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  RemoveTokenPair: damlTypes.Choice<TokenPair, RemoveTokenPair, {}, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
  Archive: damlTypes.Choice<TokenPair, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenPair.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenPair, TokenPair.Key>>;
}
export declare const TokenPair:
  damlTypes.Template<TokenPair, TokenPair.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPair:TokenPair'> &
  damlTypes.ToInterface<TokenPair, Exchange_TokenPairData.ITokenPairKeys> &
  TokenPairInterface;

export declare namespace TokenPair {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>
  export type CreateEvent = damlLedger.CreateEvent<TokenPair, TokenPair.Key, typeof TokenPair.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenPair, typeof TokenPair.templateId>
  export type Event = damlLedger.Event<TokenPair, TokenPair.Key, typeof TokenPair.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenPair, TokenPair.Key, typeof TokenPair.templateId>
}


