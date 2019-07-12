import ItbitApi from './ItbitApi';
const creds = require('./creds.json');

const api = new ItbitApi(creds[0].key, creds[0].secret, creds[0].userId)

// PUBLIC ENDPOINT EXAMPLES:

// calling GET TICKER
api.getTickers("XBTUSD")
  .then( res => {
    console.log("XBTUSD-TICKER")
    console.log(res.data)
  })

// calling GET ORDER BOOKS
// api.getOrderbooks("XBTUSD")
//   .then( orderbook => {
//       console.log(orderbook.data)
//   })

// PRIVATE ENDPOINT EXAMPLES:


// caling GET ALL WALLETS
api.getWallets()
  .then( wallets => {
    console.log("WALLETS:")
    console.log(wallets.data)
  })

// Creating New Wallet
// api.newWallet("XXTest")
//   .then( resp => {
//     console.log(resp.data)
//   })



// caling GET A WALLET
// api.getWallet("b903d575-47ad-4972-80d1-c49a66192cf5")
//   .then( wallets => {
//     console.log(wallets.data)
//   })

// List all the trades history in a wallet
// api.getWalletTrades("b903d575-47ad-4972-80d1-c49a66192cf5")
//   .then( trades => {
//     console.log(trades.data)
//   })

// create new order
// api.newOrder("d576984c-7463-41ad-bbdb-5cb3336e5eab", 'buy', 'limit', 'XBT', 0.00001, 5000, 'XBTUSD')
//   .then( order => {
//     console.log(order.data)
//   })

// // list orders
// api.getOrders("d576984c-7463-41ad-bbdb-5cb3336e5eab", {status: 'open'})
//   .then( orders => {
//     console.log(orders.data)
//   })
//
// get 1 order
// api.getOrder("d576984c-7463-41ad-bbdb-5cb3336e5eab", "f0dafc84-e3f0-4378-afbf-7d3136a4227e")
//   .then( order => {
//     console.log(order.data)
//   })

// // cancelling order
// api.cancelOrders("d576984c-7463-41ad-bbdb-5cb3336e5eab", "f0dafc84-e3f0-4378-afbf-7d3136a4227e")
//   .then( order => {
//     console.log(order.data)
//   })
