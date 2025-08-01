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

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.IsPartyRegistered = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({party: damlTypes.Party.decoder, requester: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    party: damlTypes.Party.encode(__typed__.party),
    requester: damlTypes.Party.encode(__typed__.requester),
  };
}
,
};



exports.ListParties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UnregisterParty = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({partyToRemove: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    partyToRemove: damlTypes.Party.encode(__typed__.partyToRemove),
  };
}
,
};



exports.RegisterParty = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newParty: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    newParty: damlTypes.Party.encode(__typed__.newParty),
  };
}
,
};



exports.PartyRegistry = damlTypes.assembleTemplate(
{
  templateId: '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e:Registry.PartyRegistry:PartyRegistry',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return damlTypes.Party.decoder; }); }),
  keyEncode: function (__typed__) { return damlTypes.Party.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, registeredParties: damlTypes.List(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    registeredParties: damlTypes.List(damlTypes.Party).encode(__typed__.registeredParties),
  };
}
,
  RegisterParty: {
    template: function () { return exports.PartyRegistry; },
    choiceName: 'RegisterParty',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RegisterParty.decoder; }),
    argumentEncode: function (__typed__) { return exports.RegisterParty.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PartyRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PartyRegistry).encode(__typed__); },
  },
  UnregisterParty: {
    template: function () { return exports.PartyRegistry; },
    choiceName: 'UnregisterParty',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UnregisterParty.decoder; }),
    argumentEncode: function (__typed__) { return exports.UnregisterParty.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PartyRegistry).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PartyRegistry).encode(__typed__); },
  },
  ListParties: {
    template: function () { return exports.PartyRegistry; },
    choiceName: 'ListParties',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ListParties.decoder; }),
    argumentEncode: function (__typed__) { return exports.ListParties.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.List(damlTypes.Party).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.List(damlTypes.Party).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.PartyRegistry; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  IsPartyRegistered: {
    template: function () { return exports.PartyRegistry; },
    choiceName: 'IsPartyRegistered',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.IsPartyRegistered.decoder; }),
    argumentEncode: function (__typed__) { return exports.IsPartyRegistered.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Bool.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Bool.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PartyRegistry, ['807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e', '807f53bcff3494eefc2458208d7142647070c505cab200f24a48f804789fdc1e']);

