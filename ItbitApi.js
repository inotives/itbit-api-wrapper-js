const crypto = require('crypto');
const axios = require('axios');
const qs = require("qs");

export default class ItbitApi {
  constructor (key, secret, userId){
    this.key = key;
    this.secret = secret;
    this.userId = userId;
    this.baseUrl = "https://api.itbit.com/v1";
  }

  appendQuerystring (url, query) {
    const querystring = qs.stringify(query);
    if(querystring) url += '?' + querystring
    return url
  }

  makeHeader( method, url, args ) {
    let timestamp = (new Date()).getTime()
    let nonce = timestamp+1;

    const message = nonce + JSON.stringify([method, url, args, nonce.toString(), timestamp.toString()]);

    let hash_message_digest = crypto.createHash("sha256").update(message).digest()
    let hash_buffer = Buffer.concat([Buffer.from(url), hash_message_digest]);
    let signer = crypto.createHmac('sha512', this.secret)
    const signature = signer.update(hash_buffer).digest("base64");

    const headers = {
        "Authorization": this.key + ":" + signature,
        "Content-Type": 'application/json',
        "X-Auth-Nonce": nonce,
        "X-Auth-Timestamp": timestamp
    }
    return headers
  }

  async sendRequest (method, url, args) {
    let body = args || "";
    if(method == "POST" || method == "PUT") {
      body = JSON.stringify(args);
    }
    const headers = this.makeHeader(method, url, body);
    let result = {}

    const options = {
      method: method,
      url: url,
      headers: headers,
      data: body
    }
    // console.log(options)
    return await axios(options);
  }

  /*
    PUBLIC ENDPOINT ---------------------------------------------------
  */

  async getTickers(market){
    const url = `${this.baseUrl}/markets/${market}/ticker`
    return await this.sendRequest("GET", url, "")
  }

  async getOrderbooks(market) {
    return await this.sendRequest("GET", `${this.baseUrl}/markets/${market}/order_book`, "")
  }

  /*
    PRIVATE ENDPOINT ---------------------------------------------------
  */

  // GET All Wallets in user account
  async getWallets() {
    const url = this.baseUrl + '/wallets?userId='+this.userId
    return await this.sendRequest("GET", url, "")
  }

  // GET wallet base on the given wallet id
  async getWallet(walletId) {
    let url = `${this.baseUrl}/wallets/${walletId}`
    return await this.sendRequest("GET", url, "")
  }

  // Create Wallet
  async newWallet(walletName) {
    let url = `${this.baseUrl}/wallets`
    const req_body = {
      name: walletName,
      userId: this.userId
    }
    return await this.sendRequest('POST', url, req_body)
  }

  // Get Trades from Wallets
  async getWalletTrades(walletId, query) {
    let url = `${this.baseUrl}/wallets/${walletId}/trades`
    url = this.appendQuerystring(url, query)

    return await this.sendRequest('GET', url, "")
  }

  // Create Order
  async newOrder(walletId, side, type, curr, amt, price, market, metadata, clientOrdId){
    let url = `${this.baseUrl}/wallets/${walletId}/orders`
    let req_body = {
      side: side,
      type: type,
      currency: curr,
      amount: amt.toString(),
      price: price.toString(),
      instrument: market
    }
    if(metadata) body.metadata = metadata
    if(clientOrdId) body.clientOrderIdentifier = clientOrdId
    return await this.sendRequest("POST", url, req_body)
  }

  // List Orders
  async getOrders(walletId, query) {
    let url = `${this.baseUrl}/wallets/${walletId}/orders`
    url = this.appendQuerystring(url, query)

    return await this.sendRequest('GET', url, "")
  }

  // GET detail of 1 Order
  async getOrder(walletId, orderId){
    let url = `${this.baseUrl}/wallets/${walletId}/orders/${orderId}`

    return await this.sendRequest("GET", url, "")
  }

  // Cancel order
  async cancelOrders(walletId, orderId){
    let url = `${this.baseUrl}/wallets/${walletId}/orders/${orderId}`
    return await this.sendRequest('DELETE', url, "")
  }


}// end class
