/*MADE BY AXELLAB*/
const {Discord, Guild, Client, Channel, GuildMemberManager} = require('discord.js');
const client = new Client();
const {Account, Connection, PublicKey} = require('@solana/web3.js');
const {Market} = require('@project-serum/serum');
var fs = require('fs');

// Discord bot ID
client.login(process.env.BOTID); // change here
let channelid = "877468623701147689";

let connection = new Connection('https://api.mainnet.rpcpool.com/');
let programId = new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'); // Serum program v3
let marketAddress = new PublicKey('8x8jf7ikJwgP9UthadtiGFgfFuyyyYPHL3obJAuxFWko'); //NINJA MARKET

let treshold = "60";
let arr_donepost = Array();


client.on('ready', async () => {



  setInterval(async function () {
    for(const val of await getTrade()) {
        // console.log(val)
        client.channels.cache.get(`${channelid}`).send(`${val}`)
    }
  }, 60);

    client.user.setActivity(`${ await getOrder()}`, {
      type: "WATCHING"
    });



})

async function getTrade() {
    let market = await Market.load(connection, marketAddress, {}, programId);
    let fills = await market.loadFills(connection);
    let bigorder = Array();
    let last_release = 0;

    var count = 1;
    for (let fill of fills) {
      if (fill.eventFlags.bid==true) {
        if (fill.eventFlags.maker==false) {
          text_side ="!"
          side = "buy"
        }else{
          text_side ="Sell"
          side = "sell"
        }
        if(side=='buy'){
          if(fill.size>=treshold){
            if(arr_donepost.includes(`${fill.orderId}`)){
              // NOthing here
            }else{

              bigorder.push(`🔥 Port Trade Alert! Someone Bought ${text_side} ${parseFloat(fill.size)} $PORT ||${fill.price} USDC`);
              arr_donepost.push(`${fill.orderId}`)
              console.log(fill.eventFlags)
            }
          }
        }
      }
    }
    console.log(bigorder)
    return bigorder
}


