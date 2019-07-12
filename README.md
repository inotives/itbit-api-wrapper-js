# itbit-api-wrapper

This wrapper is written as example for connecting itBit Exchange API using javascript (ES8)

### Requirement

- This lib is tested and worked on `Node 10.16.0`

### How to Run

- Clone this repo
- CD into the project root and run `npm install`
- After installation, create a `creds.json` file with the following format:

```
[
	{
		"key": "your-itbit-key",
		"secret": "your-itbit-secret",
		"userId": "your-itbit-userid"
	}
]
```

- run the example code with this: `npm run example`


### List of Endpoints wrappers
Here are all the endpoints wrappers listed on [itBit REST-API documentation site](https://api.itbit.com/docs).


#### Public Endpoint:

- **getTickers(market)**: get the tickers by market
- **getOrderbooks(market)**: get the orderbooks by market

#### Private Endpoints:

- **getWallets()**: get all user wallets
- **getWallet(walletId)**: get a wallet infos by its walletId
- **newWallet(walletName)**: create a new wallet
- **getWalletTrades(walletId, query)**: get all the trades executed on that wallet.
- **newOrder(walletId, side, type, curr, amt, price, market, metadata, coi)**: create new order
- **getOrders(walletId, query)**: list orders in a wallet
- **getOrder(walletId, orderId)**: get an order details by its orderId
- **cancelOrder(walletId, orderId)**: cancel an open id
