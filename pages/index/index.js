const bridge = require('../../utils/ali-miniapp-host-bridge');
const app = getApp();

Page({
  data: {},
  onLoad() {
    this.webViewContext = my.createWebViewContext('web-view-1');
    console.log(my);
    this.onMessageBridge = new bridge(my, this.webViewContext);
  },
  onMessage(event) {
    console.log(event);
    this.onMessageBridge.onMessage(event);
  },
});
