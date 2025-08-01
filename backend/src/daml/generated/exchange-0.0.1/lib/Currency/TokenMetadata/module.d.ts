// Generated from Currency/TokenMetadata.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type TokenMetadata = {
  name: string;
  symbol: string;
  decimals: damlTypes.Int;
  description: string;
  issuedDate: damlTypes.Time;
  version: string;
};

export declare const TokenMetadata:
  damlTypes.Serializable<TokenMetadata> & {
  }
;

