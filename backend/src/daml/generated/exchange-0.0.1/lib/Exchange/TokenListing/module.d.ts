// Generated from Exchange/TokenListing.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type ApproveUnlisting = {
};

export declare const ApproveUnlisting:
  damlTypes.Serializable<ApproveUnlisting> & {
  }
;


export declare type UnlistingRequest = {
  tokenOwner: damlTypes.Party;
  admin: damlTypes.Party;
  tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  tokenListingCid: damlTypes.ContractId<TokenListing>;
  registryKey: damlTypes.Party;
};

export declare interface UnlistingRequestInterface {
  Archive: damlTypes.Choice<UnlistingRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, UnlistingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<UnlistingRequest, UnlistingRequest.Key>>;
  ApproveUnlisting: damlTypes.Choice<UnlistingRequest, ApproveUnlisting, {}, UnlistingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<UnlistingRequest, UnlistingRequest.Key>>;
}
export declare const UnlistingRequest:
  damlTypes.Template<UnlistingRequest, UnlistingRequest.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:UnlistingRequest'> &
  damlTypes.ToInterface<UnlistingRequest, never> &
  UnlistingRequestInterface;

export declare namespace UnlistingRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>
  export type CreateEvent = damlLedger.CreateEvent<UnlistingRequest, UnlistingRequest.Key, typeof UnlistingRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<UnlistingRequest, typeof UnlistingRequest.templateId>
  export type Event = damlLedger.Event<UnlistingRequest, UnlistingRequest.Key, typeof UnlistingRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<UnlistingRequest, UnlistingRequest.Key, typeof UnlistingRequest.templateId>
}



export declare type CancelListing = {
};

export declare const CancelListing:
  damlTypes.Serializable<CancelListing> & {
  }
;


export declare type RejectListing = {
};

export declare const RejectListing:
  damlTypes.Serializable<RejectListing> & {
  }
;


export declare type ApproveListing = {
};

export declare const ApproveListing:
  damlTypes.Serializable<ApproveListing> & {
  }
;


export declare type ListingRequest = {
  tokenOwner: damlTypes.Party;
  admin: damlTypes.Party;
  tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  registryKey: damlTypes.Party;
};

export declare interface ListingRequestInterface {
  ApproveListing: damlTypes.Choice<ListingRequest, ApproveListing, damlTypes.ContractId<TokenListing>, ListingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ListingRequest, ListingRequest.Key>>;
  RejectListing: damlTypes.Choice<ListingRequest, RejectListing, {}, ListingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ListingRequest, ListingRequest.Key>>;
  CancelListing: damlTypes.Choice<ListingRequest, CancelListing, {}, ListingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ListingRequest, ListingRequest.Key>>;
  Archive: damlTypes.Choice<ListingRequest, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, ListingRequest.Key> & damlTypes.ChoiceFrom<damlTypes.Template<ListingRequest, ListingRequest.Key>>;
}
export declare const ListingRequest:
  damlTypes.Template<ListingRequest, ListingRequest.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:ListingRequest'> &
  damlTypes.ToInterface<ListingRequest, never> &
  ListingRequestInterface;

export declare namespace ListingRequest {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<ListingRequest, ListingRequest.Key, typeof ListingRequest.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<ListingRequest, typeof ListingRequest.templateId>
  export type Event = damlLedger.Event<ListingRequest, ListingRequest.Key, typeof ListingRequest.templateId>
  export type QueryResult = damlLedger.QueryResult<ListingRequest, ListingRequest.Key, typeof ListingRequest.templateId>
}



export declare type UpdateTokenListingObservers = {
};

export declare const UpdateTokenListingObservers:
  damlTypes.Serializable<UpdateTokenListingObservers> & {
  }
;


export declare type RequestUnlisting = {
};

export declare const RequestUnlisting:
  damlTypes.Serializable<RequestUnlisting> & {
  }
;


export declare type TokenListing = {
  tokenOwner: damlTypes.Party;
  admin: damlTypes.Party;
  tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  registryKey: damlTypes.Party;
  observers: damlTypes.Party[];
};

export declare interface TokenListingInterface {
  RequestUnlisting: damlTypes.Choice<TokenListing, RequestUnlisting, damlTypes.ContractId<UnlistingRequest>, TokenListing.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenListing, TokenListing.Key>>;
  UpdateTokenListingObservers: damlTypes.Choice<TokenListing, UpdateTokenListingObservers, damlTypes.ContractId<TokenListing>, TokenListing.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenListing, TokenListing.Key>>;
  Archive: damlTypes.Choice<TokenListing, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, TokenListing.Key> & damlTypes.ChoiceFrom<damlTypes.Template<TokenListing, TokenListing.Key>>;
}
export declare const TokenListing:
  damlTypes.Template<TokenListing, TokenListing.Key, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:TokenListing'> &
  damlTypes.ToInterface<TokenListing, never> &
  TokenListingInterface;

export declare namespace TokenListing {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>>
  export type CreateEvent = damlLedger.CreateEvent<TokenListing, TokenListing.Key, typeof TokenListing.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<TokenListing, typeof TokenListing.templateId>
  export type Event = damlLedger.Event<TokenListing, TokenListing.Key, typeof TokenListing.templateId>
  export type QueryResult = damlLedger.QueryResult<TokenListing, TokenListing.Key, typeof TokenListing.templateId>
}


