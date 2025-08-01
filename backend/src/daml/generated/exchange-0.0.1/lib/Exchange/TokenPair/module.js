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

var Exchange_TokenPairData = require('../../Exchange/TokenPairData/module');


exports.CreateTokenPair = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({sellingPrice: damlTypes.Numeric(10).decoder, buyingPrice: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    sellingPrice: damlTypes.Numeric(10).encode(__typed__.sellingPrice),
    buyingPrice: damlTypes.Numeric(10).encode(__typed__.buyingPrice),
  };
}
,
};



exports.TokenPairSetup = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPair:TokenPairSetup',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text))).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text))).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, liquidityProvider: damlTypes.Party.decoder, inputListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder, quoteListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    liquidityProvider: damlTypes.Party.encode(__typed__.liquidityProvider),
    inputListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__.inputListingKey),
    quoteListingKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__.quoteListingKey),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Archive: {
    template: function () { return exports.TokenPairSetup; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CreateTokenPair: {
    template: function () { return exports.TokenPairSetup; },
    choiceName: 'CreateTokenPair',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CreateTokenPair.decoder; }),
    argumentEncode: function (__typed__) { return exports.CreateTokenPair.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenPair).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenPair).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenPairSetup, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.RemoveTokenPair = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UpdateTokenPairObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.SetRate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newSellingPrice: damlTypes.Numeric(10).decoder, newBuyingPrice: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newSellingPrice: damlTypes.Numeric(10).encode(__typed__.newSellingPrice),
    newBuyingPrice: damlTypes.Numeric(10).encode(__typed__.newBuyingPrice),
  };
}
,
};



exports.GetData = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.GetLiquidityProvider = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.GetRate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({requester: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    requester: damlTypes.Party.encode(__typed__.requester),
  };
}
,
};



exports.TokenPair = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenPair:TokenPair',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, liquidityProvider: damlTypes.Party.decoder, inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, sellingPrice: damlTypes.Numeric(10).decoder, buyingPrice: damlTypes.Numeric(10).decoder, registryKey: damlTypes.Party.decoder, observers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    liquidityProvider: damlTypes.Party.encode(__typed__.liquidityProvider),
    inputTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.inputTokenKey),
    quoteTokenKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.quoteTokenKey),
    sellingPrice: damlTypes.Numeric(10).encode(__typed__.sellingPrice),
    buyingPrice: damlTypes.Numeric(10).encode(__typed__.buyingPrice),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  GetRate: {
    template: function () { return exports.TokenPair; },
    choiceName: 'GetRate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetRate.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetRate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Numeric(10), damlTypes.Numeric(10)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Numeric(10), damlTypes.Numeric(10)).encode(__typed__); },
  },
  GetLiquidityProvider: {
    template: function () { return exports.TokenPair; },
    choiceName: 'GetLiquidityProvider',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetLiquidityProvider.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetLiquidityProvider.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Party.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Party.encode(__typed__); },
  },
  GetData: {
    template: function () { return exports.TokenPair; },
    choiceName: 'GetData',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.GetData.decoder; }),
    argumentEncode: function (__typed__) { return exports.GetData.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return Exchange_TokenPairData.TokenPairData.decoder; }),
    resultEncode: function (__typed__) { return Exchange_TokenPairData.TokenPairData.encode(__typed__); },
  },
  SetRate: {
    template: function () { return exports.TokenPair; },
    choiceName: 'SetRate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SetRate.decoder; }),
    argumentEncode: function (__typed__) { return exports.SetRate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenPair).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenPair).encode(__typed__); },
  },
  UpdateTokenPairObservers: {
    template: function () { return exports.TokenPair; },
    choiceName: 'UpdateTokenPairObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateTokenPairObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateTokenPairObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenPair).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenPair).encode(__typed__); },
  },
  RemoveTokenPair: {
    template: function () { return exports.TokenPair; },
    choiceName: 'RemoveTokenPair',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RemoveTokenPair.decoder; }),
    argumentEncode: function (__typed__) { return exports.RemoveTokenPair.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TokenPair; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

, Exchange_TokenPairData.ITokenPairKeys
);


damlTypes.registerTemplate(exports.TokenPair, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);

