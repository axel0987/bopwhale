/*MADE BY AXELLAB*/
const {Discord, Guild, Client, Channel, GuildMemberManager} = require('discord.js');
const client = new Client();
const {Account, Connection, PublicKey} = require('@solana/web3.js');
const {Market} = require('@project-serum/serum');
var fs = require('fs');

// Discord bot ID
client.login(process.env.BOTID); // change here
let channelid = "869334881140871188";

let connection = new Connection('https://api.mainnet.rpcpool.com/');
let programId = new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'); // Serum program v3
let marketAddress = new PublicKey('7MmPwD1K56DthW14P1PnWZ4zPCbPWemGs3YggcT1KzsM'); //NINJA MARKET

let treshold = "1000";
let arr_donepost = Array();


client.on('ready', async () => {



  setInterval(async function () {
    for(const val of await getTrade()) {
        // console.log(val)
        client.channels.cache.get(`${channelid}`).send(`${val}`)
    }
  }, 1000);



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

              bigorder.push(`🔥  <@!599148963261710347> Ada yang beli!${text_side} ${parseFloat(fill.size)} $BOP @${fill.price} USDC`);
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


