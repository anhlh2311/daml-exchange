// Generated from Exchange/TokenSwap.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Currency_TokenLedger from '../../Currency/TokenLedger/module';

export declare type ConfirmSwap = {
};

export declare const ConfirmSwap:
  damlTypes.Serializable<ConfirmSwap> & {
  }
;


export declare type LiquidityResponse = {
  liquidityProvider: damlTypes.Party;
  swapper: damlTypes.Party;
  admin: damlTypes.Party;
  swapRequestCid: damlTypes.ContractId<SwapRequest>;
  outputTokenLockCid: damlTypes.ContractId<Currency_TokenLedger.TokenTransferLock>;
  registryKey: damlTypes.Party;
};

export declare interface LiquidityResponseInterface {
  Archive: damlTypes.Choice<LiquidityResponse, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LiquidityResponse, undefined>>;
  ConfirmSwap: damlTypes.Choice<LiquidityResponse, ConfirmSwap, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Currency_TokenLedger.TokenLedger>, damlTypes.ContractId<Currency_TokenLedger.TokenLedger>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<LiquidityResponse, undefined>>;
}
export declare const LiquidityResponse:
  damlTypes.Template<LiquidityResponse, undefined, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenSwap:LiquidityResponse'> &
  damlTypes.ToInterface<LiquidityResponse, never> &
  LiquidityResponseInterface;

export declare namespace LiquidityResponse {
  export type CreateEvent = damlLedger.CreateEvent<LiquidityResponse, undefined, typeof LiquidityResponse.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LiquidityResponse, typeof LiquidityResponse.templateId>
  export type Event = damlLedger.Event<LiquidityResponse, undefined, typeof LiquidityResponse.templateId>
  export type QueryResult = damlLedger.QueryResult<LiquidityResponse, undefined, typeof LiquidityResponse.templateId>
}



export declare type RejectSwap = {
};

export declare const RejectSwap:
  damlTypes.Serializable<RejectSwap> & {
  }
;


export declare type CancelSwap = {
};

export declare const CancelSwap:
  damlTypes.Serializable<CancelSwap> & {
  }
;


export declare type ExecuteSwap = {
  outputTokenLockCid: damlTypes.ContractId<Currency_TokenLedger.TokenTransferLock>;
};

export declare const ExecuteSwap:
  damlTypes.Serializable<ExecuteSwap> & {
  }
;


export declare type SwapRequest = {
  swapper: damlTypes.Party;
  admin: damlTypes.Party;
  liquidityProvider: damlTypes.Party;
  tokenPairKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>;
  inputAmount: damlTypes.Numeric;
  expectedOutputAmount: damlTypes.Numeric;
  inputTokenLockCid: damlTypes.ContractId<Currency_TokenLedger.TokenTransferLock>;
  registryKey: damlTypes.Party;
};

export declare interface SwapRequestInterface {
  ExecuteSwap: damlTypes.Choice<SwapRequest, ExecuteSwap, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Currency_TokenLedger.TokenLedger>, damlTypes.ContractId<Currency_TokenLedger.TokenLedger>>, SwapRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SwapRequest, SwapRequest.Key>>;
  CancelSwap: damlTypes.Choice<SwapRequest, CancelSwap, damlTypes.ContractId<Currency_TokenLedger.TokenLedger>, SwapRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SwapRequest, SwapRequest.Key>>;
  RejectSwap: damlTypes.Choice<SwapRequest, RejectSwap, {}, SwapRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SwapRequest, SwapRequest.Key>>;
  Archive: damlTypes.Choice<SwapRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, SwapRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SwapRequest, SwapRequest.Key>>;
}
export declare const SwapRequest:
  damlTypes.Template<SwapRequest, SwapRequest.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenSwap:SwapRequest'> &
  damlTypes.ToInterface<SwapRequest, never> &
  SwapRequestInterface;

export declare namespace SwapRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>>
  export type CreateEvent = damlLedger.CreateEvent<SwapRequest, SwapRequest.Key, typeof SwapRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SwapRequest, typeof SwapRequest.templateId>
  export type Event = damlLedger.Event<SwapRequest, SwapRequest.Key, typeof SwapRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<SwapRequest, SwapRequest.Key, typeof SwapRequest.templateId>
}


