import { ethers } from 'ethers';
import MDVLTokenABI from './abis/MDVLToken.json'


export class Blockchain {

    private events: Transaction[] = [];
    private provider: any | null = null;
    private originalBalance: number | null =  null;

    private wallet: any | null = null;
    private walletSigner: any | null =  null;

    private private_key = '6374e2fa7273854b2315ee4a90daa90617a4373d256246788f28b69054e08701'; // MDVL Treasury Wallet Private Key
    private send_account = '0xE8C53D9449c63c762e50Cfc876A24F9235C3A0A6'; // MDVL Treasury Wallet Address
    private to_address = '0x302dd9AB8B2C6dd9854CB942EdE9FB618D9e6737'; // Kingdoms Test User Wallet

    private tokenAddress = "0xC316BE1a6763056Abdbf838F208A87E6A263f393"; // MDVL Contract Address
    private tokenDecimalsCount = 18;
    private gas_limit = "0x100000"


    // - Purpose: Receive provider used in Kingdom.tsx, and initialize wallet & walletSigner
    constructor(provider: any) {
        this.provider = provider;

        this.wallet = new ethers.Wallet(this.private_key)
        this.walletSigner = this.wallet.connect(this.provider)
    }


    // - Caller: src/Kingdom/Kingdom.tsx -> 'onMine()' & 'onClaim()'
    // - Purpose: Appends new transaction events to our 'events' array above.
    // - Views: 'Spots'
    public addEvent(event: Transaction) {
        this.events[this.events.length] = event;
    }


    // - Caller: src/Kingdom/Kingdom.tsx -> 'save()'
    // - Purpose: Calculate the rewards harvested during the current session, and claim them.
    // - Views: 'Withdraw Rewards' button
    public async claimRewardsAndSave(currentBalance, originalBalance){
        const transactionsSum = await this.calculateEventsSum(currentBalance, originalBalance);
        const send_token_amount = transactionsSum.toString();

        console.log("transactionsSum", transactionsSum);
        console.log("send_token_amount", send_token_amount);

        if (this.provider){

            await this.sendToBlockchain(
              this.tokenAddress,
              this.to_address,
              this.send_account,
              this.private_key,
              send_token_amount
            );

        }
    }


    // - Caller: -> claimRewardsAndSave()
    // - Purpose: Calculate the rewards harvested during the current session
    public async calculateEventsSum(currentBalance, originalBalance){
      // Original = 10
      // Current = 9
      // return (9 - 10) = (-1)

      // Original = 10
      // Current = 15
      // return (15 - 10) = (5)
        return (currentBalance - originalBalance)
    }
   
      
    // - Caller: -> claimRewardsAndSave()
    // - Purpose: Combine the data points gathered, and submit a transaction to the Blockchain.
    public async sendToBlockchain(
        contract_address: string,
        to_address: string,
        send_account: string,
        private_key: string,
        send_token_amount
    ) {
        await this.provider.getGasPrice()
          .then((currentGasPrice) => {
              let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
              let numberOfTokensToSend = ethers.utils.parseUnits(send_token_amount, this.tokenDecimalsCount)
              let contract = new ethers.Contract(contract_address, MDVLTokenABI, this.walletSigner)

              this.consoleLogSubmitTransactionValues(currentGasPrice, gas_price, numberOfTokensToSend, this.wallet, this.walletSigner, contract)

              // Send transaction to the blockchain
              contract.transfer(to_address, numberOfTokensToSend)
                .then((transferResult) => {
                    console.dir(transferResult)
                    alert("Transaction Successfully Sent 👑⚔️💰🔥")
                })
                .catch(error => {
                    console.log(error);
                    alert("Uh-oh there was an error.")
                })
          })
          .catch(error => {
            console.log('Error on await getGasPrice() chain', error);
          })
    }


    // - Purpose: Log important values from sendToBlockchain() to the console
    public consoleLogSubmitTransactionValues(currentGasPrice?, gas_price?, numberOfTokensToSend?, wallet?, walletSigner?, contract?){
        console.log(`currentGasPrice: ${currentGasPrice}`);
        console.log(`gas_price: ${gas_price}`);
        console.log(`numberOfTokensToSend: ${numberOfTokensToSend}`);
        console.log("wallet", wallet);
        console.log("walletSigner", walletSigner);
        console.log('Contract', contract);
    }

}
