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

var Currency_TokenMetadata = require('../../Currency/TokenMetadata/module');


exports.Initialize = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TokenSetup = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenSetup',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, initialSupply: damlTypes.Numeric(10).decoder, metadata: Currency_TokenMetadata.TokenMetadata.decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    initialSupply: damlTypes.Numeric(10).encode(__typed__.initialSupply),
    metadata: Currency_TokenMetadata.TokenMetadata.encode(__typed__.metadata),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Archive: {
    template: function () { return exports.TokenSetup; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Initialize: {
    template: function () { return exports.TokenSetup; },
    choiceName: 'Initialize',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Initialize.decoder; }),
    argumentEncode: function (__typed__) { return exports.Initialize.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.ContractId(exports.TokenLedger)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.ContractId(exports.TokenLedger)).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenSetup, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.Cancel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Reject = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Accept = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TokenTransferLock = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenTransferLock',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, sender: damlTypes.Party.decoder, recipient: damlTypes.Party.decoder, amount: damlTypes.Numeric(10).decoder, symbol: damlTypes.Text.decoder, metadata: Currency_TokenMetadata.TokenMetadata.decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    sender: damlTypes.Party.encode(__typed__.sender),
    recipient: damlTypes.Party.encode(__typed__.recipient),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    metadata: Currency_TokenMetadata.TokenMetadata.encode(__typed__.metadata),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Accept: {
    template: function () { return exports.TokenTransferLock; },
    choiceName: 'Accept',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Accept.decoder; }),
    argumentEncode: function (__typed__) { return exports.Accept.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenLedger).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenLedger).encode(__typed__); },
  },
  Reject: {
    template: function () { return exports.TokenTransferLock; },
    choiceName: 'Reject',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Reject.decoder; }),
    argumentEncode: function (__typed__) { return exports.Reject.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenTransferLock).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenTransferLock).encode(__typed__); },
  },
  Cancel: {
    template: function () { return exports.TokenTransferLock; },
    choiceName: 'Cancel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Cancel.decoder; }),
    argumentEncode: function (__typed__) { return exports.Cancel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenLedger).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenLedger).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TokenTransferLock; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenTransferLock, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.Burn = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tokenCid: damlTypes.ContractId(exports.TokenLedger).decoder, amountToBurn: damlTypes.Optional(damlTypes.Numeric(10)).decoder, }); }),
  encode: function (__typed__) {
  return {
    tokenCid: damlTypes.ContractId(exports.TokenLedger).encode(__typed__.tokenCid),
    amountToBurn: damlTypes.Optional(damlTypes.Numeric(10)).encode(__typed__.amountToBurn),
  };
}
,
};



exports.Mint = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.TokenMaster = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenMaster',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, totalSupply: damlTypes.Numeric(10).decoder, metadata: Currency_TokenMetadata.TokenMetadata.decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    totalSupply: damlTypes.Numeric(10).encode(__typed__.totalSupply),
    metadata: Currency_TokenMetadata.TokenMetadata.encode(__typed__.metadata),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Mint: {
    template: function () { return exports.TokenMaster; },
    choiceName: 'Mint',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Mint.decoder; }),
    argumentEncode: function (__typed__) { return exports.Mint.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.ContractId(exports.TokenLedger)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.ContractId(exports.TokenLedger)).encode(__typed__); },
  },
  Burn: {
    template: function () { return exports.TokenMaster; },
    choiceName: 'Burn',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Burn.decoder; }),
    argumentEncode: function (__typed__) { return exports.Burn.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.Optional(damlTypes.ContractId(exports.TokenLedger))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenMaster), damlTypes.Optional(damlTypes.ContractId(exports.TokenLedger))).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TokenMaster; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenMaster, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.LockTokenForTransfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({recipient: damlTypes.Party.decoder, transferAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    recipient: damlTypes.Party.encode(__typed__.recipient),
    transferAmount: damlTypes.Numeric(10).encode(__typed__.transferAmount),
  };
}
,
};



exports.TokenLedger = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Currency.TokenLedger:TokenLedger',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, holder: damlTypes.Party.decoder, amount: damlTypes.Numeric(10).decoder, symbol: damlTypes.Text.decoder, metadata: Currency_TokenMetadata.TokenMetadata.decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    holder: damlTypes.Party.encode(__typed__.holder),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    metadata: Currency_TokenMetadata.TokenMetadata.encode(__typed__.metadata),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  LockTokenForTransfer: {
    template: function () { return exports.TokenLedger; },
    choiceName: 'LockTokenForTransfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.LockTokenForTransfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.LockTokenForTransfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenTransferLock), damlTypes.Optional(damlTypes.ContractId(exports.TokenLedger))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.TokenTransferLock), damlTypes.Optional(damlTypes.ContractId(exports.TokenLedger))).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TokenLedger; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenLedger, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);

