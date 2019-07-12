import ItbitApi from './ItbitApi';
const creds = require('./creds.json');

const api = new ItbitApi(creds[0].key, creds[0].secret, creds[0].userId)

const examples = async () => {

  const ticker = await api.getTickers("XBTUSD")
    .then( res => res.data )

  const wallets = await api.getWallets()
    .then( wallets => wallets.data )



  console.log("----------------------\nPUBLIC ENDPOINT:\n----------------------")
  console.log(ticker)

  console.log("----------------------\nPRIVATE ENDPOINT:\n----------------------")
  console.log(wallets)

  console.log("List User Orders ....")
  const orders = await api.getOrders( wallets[0].id, {status: 'filled'})
    .then( orders => orders.data)
  console.log(orders)
}

examples();
