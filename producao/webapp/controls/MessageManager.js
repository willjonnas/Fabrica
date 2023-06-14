sap.ui.define([
 "sap/ui/base/EventProvider",

"sap/ui/model/json/JSONModel",

"sap/ui/model/resource/ResourceModel"

],

function (EventProvider, JSONModel, ResourceModel) {

"use strict";
    const MessageManager = EventProvider.extend("com.cs4.wl.producao.controls.MessageManager", {

      constructor: function () {
        EventProvider.apply(this, arguments);
      }
    })

  MessageManager.prototype.open = function () {
    this.initModel();
    if (!this.__oMessagePopover) {
      var sFragment = "com.cs4.wl.producao.fragments.MessageViewDialog";
      this.__oMessagePopover = sap.ui.xmlfragment(sFragment, this);
      this.__oMessagePopover.setModel(this.oI18n, "i18n");
      this.__oMessagePopover.setModel(this._oModel, "messages");
      this.__oMessagePopover.attachAfterClose(function () {
        this.clearMessages();
      }.bind(this))
    }
    this.__oMessagePopover.getModel("messages").refresh(true);
    this.__oMessagePopover.open();
  },
  MessageManager.prototype.close = function () {
    if (this.__oMessagePopover) {
      this.__oMessagePopover.close();
    }
  },
  MessageManager.prototype.clearMessages = function () {
    this.initModel();

    if (this.__oMessagePopover) {

      // para trás nas mensagens
      var aContent = this.__oMessagePopover.getContent();
      if (aContent.length > 0) {
        aContent[0].navigateBack();
      }
    }

    this._oModel.setData([]);
    return this;
  },
  MessageManager.prototype._parseSeverity = function (sSeverity) {
    return sSeverity.charAt(0).toUpperCase() + sSeverity.slice(1);
  },
  MessageManager.prototype.hasErrors = function () {
    var aMessages = this._oModel.getData();
    for (var i = 0; i < aMessages.length; i++) {
      if (aMessages[i].type == "Error") {
        return true;
      }
    }
    return false;
  },
  MessageManager.prototype.addFromError = function (oResult) {
    this.initModel();
    var sMessage;

    var oError;
    try {
      oError = JSON.parse(oResult.responseText);
    } catch (e) { }

    if (!oError && oResult.statusText) {
      this.addMessage({
        type: "Error",
        title: oResult.statusText
      });
      return;
    }

    if (oError && oError.error && oError.error.innererror && oError.error.innererror.errordetails) {

      oError.error.innererror.errordetails.forEach(function (err) {
        var title = err.message;

        this.addMessage({
          type: err.severity.charAt(0).toUpperCase() + err.severity.slice(1),
          title: title
        });
      }.bind(this))
    }

    return this;
  },
  MessageManager.prototype.addMessage = function (oMessage) {
    this.initModel();

    oMessage.type = this._parseSeverity(oMessage.type);

    var aMessages = this._oModel.getData();
    aMessages.unshift(oMessage);
    this._oModel.setData(aMessages);
  },
  MessageManager.prototype.initModel = function () {
    if (!this._oModel) {

      this._oButtons = new JSONModel([]);
      this._oModel = new JSONModel([]);

      this.oI18n = new ResourceModel({
        bundleName: "com.cs4.wl.producao.i18n.i18n"
      });
    }
  },
  MessageManager.prototype.onPressClose = function (oEvent, sAction) {
    this.close();

  }
  return MessageManager;
});