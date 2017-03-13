var crypto = require('crypto');
var req = require('request');
var qs = require('qs');

var self;

function itbitApi(apiEndpoint, apiKey, apiSecret, userId){
  self = this;

  this.api_address = apiEndpoint;
  this.user_id = userId;
  this.client_key = apiKey;
  this.secret = apiSecret;
  console.log(this)

}

function appendQuerystring(url, query){
  var querystring = qs.stringify(query);
  if(querystring) url += '?' + querystring;

  return url;
}

// Private::Function to sign the message with crypto hashing
function signMessage(secret, verb, url, body, nonce, timestamp, message) {


  // creating a hash contents
  var hash_message = crypto.createHash("sha256"); //create a hash object with sha25
  var hash_message_digest = hash_message.update(message).digest("binary"); //updating the hash object with message and encode with binary digest.

  // creating signer
  var signer = crypto.createHmac("sha512", secret); // create and return Hmac object.

  // creating signature along with the hash_message
  var signature = signer.update(url + hash_message_digest).digest("base64");

  return signature;
}

function makeHeader (method, url, args){
  var timestamp = (new Date()).getTime();
  var nonce = timestamp++;

  var message = nonce + JSON.stringify([method, url, args, nonce.toString(), timestamp.toString()]);
  var signature = signMessage(self.secret, method, url, args, nonce, timestamp, message);
  var headers = {
    "Authorization": self.client_key + ":" + signature,
    "Content-Type": 'application/json',
    "X-Auth-Nonce": nonce,
    "X-Auth-Timestamp": timestamp
  };

  return headers;
};

function sendRequest (method, url, args, callback){

  var body = args || "";

  if(method == 'POST' || method == 'PUT') body = JSON.stringify(args);

  var headers = makeHeader(method, url, body);

  var options = {
    method: method,
    uri: url,
    headers: headers,
    body: body
  };
  //console.log(options);
  var reqSendTime = Date.now();

  req(options, function(err, res, body){
    var resSendTime = Date.now();

    if(!err && res.statusCode >= 200 && res.statusCode < 300)
    {
      // update the response object
      res.requestSendTime = reqSendTime;
      res.responseSendTime = resSendTime;
      res.responseTime = resSendTime - reqSendTime;
      res.requestBody = args;
    }
    else {
      // try to convert body to js object
      try{
        //console.log(body);
        msg = JSON.parse(body);
      }catch (e){
        // if cant, meaning it must have no json body. so manually append the err object
        if(res)
          err = {statusCode: 'UNKNOWN', type:'ERROR', code: 'NaN', supportId: 'NaN', url: url, message: res.body, descr: res.body};
        else
          err = {statusCode: 'UNKNOWN', type:'ERROR', code: 'NaN', supportId: 'NaN', url: url, message: 'NaN', descr: 'NaN'};

        console.log(err);
        callback(err);
        return console.log('ERROR: '+ err.statusCode + ' ' + err.message);
      }

      err = {statusCode: res.statusCode, type:'ERROR', code: msg.code, supportId: msg.supportId, url: url, message: msg.message, descr: msg.description};
      callback (err);
      return console.log('ERROR: '+ err.statusCode + ' ' + err.message);

    }

    // return the callback for success api call, with error object null
    callback(null, res, body);
  });

};


/**
----------------------------------------------------------------------------
PUBLIC API
----------------------------------------------------------------------------
**/

// GET Tickers
itbitApi.prototype.getTickers = function(tickerSymbol, callback){
  var url = self.api_address + '/markets/' + tickerSymbol + '/ticker';

  sendRequest("GET", url, "", callback);
};

// GET Order Books
itbitApi.prototype.getOrderBooks = function(tickerSymbol, callback){
  var url = self.api_address + '/markets/' + tickerSymbol + '/order_book';

  sendRequest("GET", url, "", callback);
};





/**
----------------------------------------------------------------------------
PRIVATE API
----------------------------------------------------------------------------
**/

// POST new wallets
itbitApi.prototype.createWallet = function(name, callback){
  var url = self.api_address + '/wallets';
  var req_body = {
    name: name,
    userId: self.user_id
  };

  sendRequest('POST', url, req_body, callback);
};

// GET wallet Detail
itbitApi.prototype.getWallet = function (walletId, callback){
  var url = self.api_address + '/wallets/' + (walletId || self.default_wallet);
  sendRequest('GET', url, "", callback);
};


// GET all user's wallets
itbitApi.prototype.getAllWallets = function(query, callback){
  var url = self.api_address + '/wallets?userId='+self.user_id;
  var querystring = qs.stringify(query);
  if(querystring) url += '&' + querystring;

  sendRequest('GET', url, "", callback);
};

// GET Wallet Balances
itbitApi.prototype.getWalletBalance = function (walletId, currCode, callback){
  var url = self.api_address + '/wallets/' + (walletId || self.default_wallet) + '/balances/' + currCode;
  sendRequest('GET', url, "", callback);
};

// GET Wallet Trades
itbitApi.prototype.getWalletTrades = function (walletId, query, callback){
  var url = self.api_address + '/wallets/' + (walletId || self.default_wallet) + '/trades' ;
  url = appendQuerystring(url, query);

  sendRequest('GET', url, "", callback);
};

// POST new Order
itbitApi.prototype.createOrder = function (walletId, side, type, currency, amt, price ,instrument, metadata, clientOrderIdentifier, callback){
  var url = self.api_address + '/wallets/' + (walletId || self.default_wallet) + '/orders' ;
  // create a new json body
  var body = {
    side: side,
    type: type,
    currency: currency,
    amount: amt.toString(),
    price: price.toString(),
    instrument: instrument
  };

  console.log(body);
  //optional component
  if (metadata) body.metadata = metadata;
  if (clientOrderIdentifier) body.clientOrderIdentifier = clientOrderIdentifier;

  sendRequest('POST', url, body, callback);
};

itbitApi.prototype.createOrderWithDisplay = function (walletId, side, type, currency, amt, price, display ,instrument, metadata, clientOrderIdentifier, callback){
  var url = self.api_address + '/wallets/' + (walletId || self.default_wallet) + '/orders' ;
  // create a new json body
  var body = {
    side: side,
    type: type,
    currency: currency,
    display: display.toString(),
    amount: amt.toString(),
    price: price.toString(),
    instrument: instrument
  };

  console.log(body);
  //optional component
  if (metadata) body.metadata = metadata;
  if (clientOrderIdentifier) body.clientOrderIdentifier = clientOrderIdentifier;

  sendRequest('POST', url, body, callback);
};


// GET all orders : can be filter by status (open, cancelled, rejected, filled)
itbitApi.prototype.getOrders = function (walletId, query, callback){
  var url = self.api_address + '/wallets/'+(walletId || self.default_wallet)+'/orders';
  url = appendQuerystring(url, query);

  sendRequest('GET', url, '', callback);
};

// GET Funding History:
itbitApi.prototype.getFundingHistory = function(walletId, query, callback) {
  var url = self.api_address + '/wallets/'+(walletId || self.default_wallet)+'/funding_history';
  url = appendQuerystring(url, query);
  console.log(url)
  sendRequest('GET', url, '', callback);
}

// GET orders
itbitApi.prototype.getOrder = function (walletId, orderId, callback){
  var url = self.api_address + '/wallets/'+(walletId || self.default_wallet)+'/orders/'+orderId;

  sendRequest('GET', url, '', callback);
};


// DELETE orders
itbitApi.prototype.cancelOrder = function (walletId, orderId, callback){
  var url = self.api_address + '/wallets/'+(walletId || self.default_wallet)+'/orders/'+orderId;

  sendRequest('DELETE', url, '', callback);
};

// Wallet Transfer
itbitApi.prototype.createWalletTransfer = function (fromWallet, toWallet, amt, currCode, callback){
  var url = self.api_address + '/wallet_transfers';
  var json_body = {
    sourceWalletId: fromWallet,
    destinationWalletId: toWallet,
    amount: amt,
    currencyCode: currCode
  };

  sendRequest('POST', url, json_body, callback);
};


// Withdraw cryptocurrency
itbitApi.prototype.cryptocurrencyWithdrawalRequest = function (walletId, currency, amt, address, callback){
  var url = self.api_address + '/wallets/'+ (walletId || self.default_wallet) + '/cryptocurrency_withdrawals';
  var json_body = {
    currency: currency,
    amount: amt,
    address: address
  };

  sendRequest('POST', url, json_body, callback);
};


// Deposit cryptocurrency
itbitApi.prototype.cryptocurrencyDepositRequest = function (walletId, currency, metadata, callback){
  var url = self.api_address + '/wallets/'+ (walletId || self.default_wallet) + '/cryptocurrency_deposits';
  var json_body = {
    currency: currency,
  };
  if(metadata) json_body.metadata = metadata;

  sendRequest('POST', url, json_body, callback);
};



module.exports = itbitApi;
