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

var Currency_TokenLedger = require('../../Currency/TokenLedger/module');


exports.ConfirmSwap = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.LiquidityResponse = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenSwap:LiquidityResponse',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({liquidityProvider: damlTypes.Party.decoder, swapper: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, swapRequestCid: damlTypes.ContractId(exports.SwapRequest).decoder, outputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    liquidityProvider: damlTypes.Party.encode(__typed__.liquidityProvider),
    swapper: damlTypes.Party.encode(__typed__.swapper),
    admin: damlTypes.Party.encode(__typed__.admin),
    swapRequestCid: damlTypes.ContractId(exports.SwapRequest).encode(__typed__.swapRequestCid),
    outputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).encode(__typed__.outputTokenLockCid),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Archive: {
    template: function () { return exports.LiquidityResponse; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ConfirmSwap: {
    template: function () { return exports.LiquidityResponse; },
    choiceName: 'ConfirmSwap',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfirmSwap.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfirmSwap.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Currency_TokenLedger.TokenLedger), damlTypes.ContractId(Currency_TokenLedger.TokenLedger)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Currency_TokenLedger.TokenLedger), damlTypes.ContractId(Currency_TokenLedger.TokenLedger)).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LiquidityResponse, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.RejectSwap = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.CancelSwap = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ExecuteSwap = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({outputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).decoder, }); }),
  encode: function (__typed__) {
  return {
    outputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).encode(__typed__.outputTokenLockCid),
  };
}
,
};



exports.SwapRequest = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenSwap:SwapRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text))).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text))).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({swapper: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, liquidityProvider: damlTypes.Party.decoder, tokenPairKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder, inputAmount: damlTypes.Numeric(10).decoder, expectedOutputAmount: damlTypes.Numeric(10).decoder, inputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    swapper: damlTypes.Party.encode(__typed__.swapper),
    admin: damlTypes.Party.encode(__typed__.admin),
    liquidityProvider: damlTypes.Party.encode(__typed__.liquidityProvider),
    tokenPairKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text), pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__.tokenPairKey),
    inputAmount: damlTypes.Numeric(10).encode(__typed__.inputAmount),
    expectedOutputAmount: damlTypes.Numeric(10).encode(__typed__.expectedOutputAmount),
    inputTokenLockCid: damlTypes.ContractId(Currency_TokenLedger.TokenTransferLock).encode(__typed__.inputTokenLockCid),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  ExecuteSwap: {
    template: function () { return exports.SwapRequest; },
    choiceName: 'ExecuteSwap',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ExecuteSwap.decoder; }),
    argumentEncode: function (__typed__) { return exports.ExecuteSwap.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Currency_TokenLedger.TokenLedger), damlTypes.ContractId(Currency_TokenLedger.TokenLedger)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(Currency_TokenLedger.TokenLedger), damlTypes.ContractId(Currency_TokenLedger.TokenLedger)).encode(__typed__); },
  },
  CancelSwap: {
    template: function () { return exports.SwapRequest; },
    choiceName: 'CancelSwap',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelSwap.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelSwap.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(Currency_TokenLedger.TokenLedger).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(Currency_TokenLedger.TokenLedger).encode(__typed__); },
  },
  RejectSwap: {
    template: function () { return exports.SwapRequest; },
    choiceName: 'RejectSwap',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectSwap.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectSwap.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.SwapRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.SwapRequest, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);

