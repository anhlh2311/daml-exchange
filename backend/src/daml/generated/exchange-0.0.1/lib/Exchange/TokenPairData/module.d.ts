// Generated from Exchange/TokenPairData.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type ITokenPairKeys = damlTypes.Interface<'807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPairData:ITokenPairKeys'> & TokenPairKeyView;
export declare interface ITokenPairKeysInterface {
  Archive: damlTypes.Choice<ITokenPairKeys, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.InterfaceCompanion<ITokenPairKeys, undefined>>;
}
export declare const ITokenPairKeys:
  damlTypes.InterfaceCompanion<ITokenPairKeys, undefined, '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPairData:ITokenPairKeys'> &
  damlTypes.FromTemplate<ITokenPairKeys, unknown> &
  ITokenPairKeysInterface;


export declare type TokenPairKeyView = {
  inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
};

export declare const TokenPairKeyView:
  damlTypes.Serializable<TokenPairKeyView> & {
  }
;


export declare type TokenPairData = {
  admin: damlTypes.Party;
  liquidityProvider: damlTypes.Party;
  inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>;
  sellingPrice: damlTypes.Numeric;
  buyingPrice: damlTypes.Numeric;
  registryKey: damlTypes.Party;
};

export declare const TokenPairData:
  damlTypes.Serializable<TokenPairData> & {
  }
;

