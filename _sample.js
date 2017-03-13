var itBitApiConnection = require('./ItbitApi.js');

// ---- PROD Cred -----
var apiEndpoint = "https://api.itbit.com/v1";
var userId = "your-user-id";
var apiKey = "your-api-key";
var apiSecret = "your-api-secret";


// create an itbit client wrapper object
var itbitApi = new itBitApiConnection(apiEndpoint, apiKey, apiSecret, userId);


// PUBLIC API -------------------------------------------------------------------------------------------

var orderbooks = function(){
  itbitApi.getOrderBooks('XBTUSD', function(err, res, data){
    console.log('\n>> PUBLIC API :');

    console.log('--- GET ORDERBOOK ---');
    if (err) return console.log(err);
    console.log(data);

  });
};

var tickers = function (){
  itbitApi.getTickers('XBTUSD', function(err, res, data){
    console.log('\n>> PUBLIC API :');

    console.log('--- GET TICKER ---');
    if (err) return console.log(err);
    console.log(data);

  });
}

orderbooks();
tickers();





// PRIVATE API ------------------------------------------------------------------------------------------

// note: using async package here to run each method in series, else you could also use the call back (similar to get ticker example)

/* -------------------------------------------------------------------------------------------
Sample Test Cases 01 (run 1s after get ticker api):
- First get all wallets (by default user will have 1 wallets created when account is created)
- Next get the wallet and show the available balances
---------------------------------------------------------------------------------------------- */


// uncomment the following .....

setTimeout(function(){
  //your code to be executed after 1 seconds
  console.log('\n>> PRIVATE API :');
  itbitApi.getAllWallets(null, function(err, res, wallets){
    if(err) return console.log(err);
    console.log('>> ALL Wallets');
    var all_wallets = JSON.parse(wallets);
    //display all wallets
    console.log(all_wallets);

    first_wallet_id = all_wallets[0].id;

    // itbitApi.createOrder(first_wallet_id, 'buy', 'limit', 'XBT', '0.0001', '200','XBTUSD', null, null, function(order_err, order_res, order_info){
    //   if(order_err) {
    //     console.log(order_err);
    //     console.log(order_res);
    //     return ;
    //   }
    // });


    // itbitApi.getWalletOrders(first_wallet_id, {status: 'open'}, function(error, res, result){
    //   console.log('All Orders::');
    //   console.log(result);
    // });

    // itbitApi.getOrders(first_wallet_id, {status:"open"}, function(error, res, result){
    //   console.log(result);
    // });


    // itbitApi.getWalletTrades(first_wallet_id, {}, function(err, res, data){
    //   console.log(data);
    // })

  });



}, 1000);
