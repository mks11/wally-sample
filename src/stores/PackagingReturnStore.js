import { observable, action, decorate } from "mobx";
class PackagingReturnStore {
  packaging_urls = [
    // "https://codesandbox.io/s/xlbfh?file=/demo.js:1014-1076",
    // "https://codesandbox.io/s/xlbfh?file=/demo.js:1014-1076",
    // "http://chart.apis.google.com/chart?chs=500x500&chma=0,0,100,100&cht=p&chco=FF0000%2CFFFF00%7CFF8000%2C00FF00%7C00FF00%2C0000FF&chd=t%3A122%2C42%2C17%2C10%2C8%2C7%2C7%2C7%2C7%2C6%2C6%2C6%2C6%2C5%2C5&chl=122%7C42%7C17%7C10%7C8%7C7%7C7%7C7%7C7%7C6%7C6%7C6%7C6%7C5%7C5&chdl=android%7Cjava%7Cstack-trace%7Cbroadcastreceiver%7Candroid-ndk%7Cuser-agent%7Candroid-webview%7Cwebview%7Cbackground%7Cmultithreading%7Candroid-source%7Csms%7Cadb%7Csollections%7Cactivity|Chart' [ChartLink]",
  ];

  async addPackagingURL(url) {
    this.packaging_urls.push(url);
  }

  clearEntries() {
    this.packaging_urls = [];
  }
}

decorate(PackagingReturnStore, {
  packaging_urls: observable,
  addPackagingURL: action,
  clearEntries: action,
});

export default new PackagingReturnStore();
