
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

// Purpose:
    // - Handle UI when a user switches their wallet account or chain
// Location:
    // - src/Kingdom/Kingdom.tsx


    const accountChangedHandler = async (newAccount) => {
        setDefaultAccount(newAccount);
        await getMDVLBalance(provider, newAccount.toString())
          .then((formattedBalance) => {
              console.log("formattedBalance", formattedBalance);
              setOriginalBalance(formattedBalance);
              setBalance(formattedBalance);
          })
          .catch(error => {
            setErrorMessage(error.message);
          })
    }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    window.ethereum.on('accountsChanged', accountChangedHandler);
    window.ethereum.on('chainChanged', chainChangedHandler);



// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 


// Purpose:
    // - sendToBlockchain() functionality call (including Ethereum fallback example)
// Location:
    // - src/Blockchain/Blockchain.ts

 
    // Full version that worked for reference.

    public async sendToBlockchain(
        contract_address: string,
        to_address: string,
        send_account: string,
        private_key: string,
        send_token_amount
    ) {
   
        let wallet = new ethers.Wallet(private_key)
        let walletSigner = wallet.connect(this.provider)


        await this.provider.getGasPrice()
          .then((currentGasPrice) => {
              let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
              console.log(`gas_price: ${gas_price}`)
          
              if (contract_address) {
                // general token send
                let contract = new ethers.Contract(contract_address, MDVLTokenABI, walletSigner)
          
                // How many tokens?
                let numberOfTokens = ethers.utils.parseUnits(send_token_amount, this.tokenDecimalsCount)
                console.log(`numberOfTokens: ${numberOfTokens}`)
          
                // Send tokens
                contract.transfer(to_address, numberOfTokens)
                  .then((transferResult) => {
                      console.dir(transferResult)
                      alert("Transaction Successfully Sent 👑⚔️💰🔥")
                  })

              } 

              // Sending ETHER
              else {
                const tx = {
                  from: send_account,
                  to: to_address,
                  value: ethers.utils.parseEther(send_token_amount),
                  nonce: this.window.ethersProvider.getTransactionCount(
                    send_account,
                    "latest"
                  ),
                  gasLimit: ethers.utils.hexlify(this.gas_limit), // 100000
                  gasPrice: gas_price,
                }
                console.dir(tx)
                try {
                  walletSigner.sendTransaction(tx)
                  .then((transaction) => {
                    console.dir(transaction)
                    alert("Send finished!")
                  })
                } catch (error) {
                  alert("failed to send!!")
                }
              }
            })
        
    }

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 