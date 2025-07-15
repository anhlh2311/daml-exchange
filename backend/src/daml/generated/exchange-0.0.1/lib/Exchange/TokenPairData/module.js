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

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

exports.ITokenPairKeys = damlTypes.assembleInterface(
  '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPairData:ITokenPairKeys',
  function () { return exports.TokenPairKeyView; },
  {
    Archive: {
      template: function () { return exports.ITokenPairKeys; },
      choiceName: 'Archive',
      argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
      argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
      resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
      resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
    },
  });



exports.TokenPairKeyView = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.inputTokenKey),
    quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.quoteTokenKey),
  };
}
,
};



exports.TokenPairData = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, liquidityProvider: damlTypes.Party.decoder, inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, sellingPrice: damlTypes.Numeric(10).decoder, buyingPrice: damlTypes.Numeric(10).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    liquidityProvider: damlTypes.Party.encode(__typed__.liquidityProvider),
    inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.inputTokenKey),
    quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.quoteTokenKey),
    sellingPrice: damlTypes.Numeric(10).encode(__typed__.sellingPrice),
    buyingPrice: damlTypes.Numeric(10).encode(__typed__.buyingPrice),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
};

