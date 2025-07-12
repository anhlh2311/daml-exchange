"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');


exports.TokenMetadata = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({name: damlTypes.Text.decoder, symbol: damlTypes.Text.decoder, decimals: damlTypes.Int.decoder, description: damlTypes.Text.decoder, issuedDate: damlTypes.Time.decoder, version: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    name: damlTypes.Text.encode(__typed__.name),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    decimals: damlTypes.Int.encode(__typed__.decimals),
    description: damlTypes.Text.encode(__typed__.description),
    issuedDate: damlTypes.Time.encode(__typed__.issuedDate),
    version: damlTypes.Text.encode(__typed__.version),
  };
}
,
};

