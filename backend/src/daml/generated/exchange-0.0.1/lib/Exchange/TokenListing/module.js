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


exports.ApproveUnlisting = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UnlistingRequest = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:UnlistingRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tokenOwner: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, tokenListingCid: damlTypes.ContractId(exports.TokenListing).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    tokenOwner: damlTypes.Party.encode(__typed__.tokenOwner),
    admin: damlTypes.Party.encode(__typed__.admin),
    tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.tokenMasterKey),
    tokenListingCid: damlTypes.ContractId(exports.TokenListing).encode(__typed__.tokenListingCid),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  Archive: {
    template: function () { return exports.UnlistingRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ApproveUnlisting: {
    template: function () { return exports.UnlistingRequest; },
    choiceName: 'ApproveUnlisting',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveUnlisting.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveUnlisting.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.UnlistingRequest, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.CancelListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RejectListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ApproveListing = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ListingRequest = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:ListingRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tokenOwner: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, registryKey: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    tokenOwner: damlTypes.Party.encode(__typed__.tokenOwner),
    admin: damlTypes.Party.encode(__typed__.admin),
    tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.tokenMasterKey),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
  };
}
,
  ApproveListing: {
    template: function () { return exports.ListingRequest; },
    choiceName: 'ApproveListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenListing).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenListing).encode(__typed__); },
  },
  RejectListing: {
    template: function () { return exports.ListingRequest; },
    choiceName: 'RejectListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CancelListing: {
    template: function () { return exports.ListingRequest; },
    choiceName: 'CancelListing',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CancelListing.decoder; }),
    argumentEncode: function (__typed__) { return exports.CancelListing.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ListingRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ListingRequest, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);



exports.UpdateTokenListingObservers = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RequestUnlisting = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.TokenListing = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Exchange.TokenListing:TokenListing',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text)).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({tokenOwner: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder, registryKey: damlTypes.Party.decoder, observers: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    tokenOwner: damlTypes.Party.encode(__typed__.tokenOwner),
    admin: damlTypes.Party.encode(__typed__.admin),
    tokenMasterKey: pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__.tokenMasterKey),
    registryKey: damlTypes.Party.encode(__typed__.registryKey),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
  };
}
,
  RequestUnlisting: {
    template: function () { return exports.TokenListing; },
    choiceName: 'RequestUnlisting',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RequestUnlisting.decoder; }),
    argumentEncode: function (__typed__) { return exports.RequestUnlisting.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UnlistingRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UnlistingRequest).encode(__typed__); },
  },
  UpdateTokenListingObservers: {
    template: function () { return exports.TokenListing; },
    choiceName: 'UpdateTokenListingObservers',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateTokenListingObservers.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateTokenListingObservers.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.TokenListing).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.TokenListing).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.TokenListing; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.TokenListing, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);

