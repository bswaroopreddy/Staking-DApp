import React, {Component} from "react";
import './App.css'
import Navbar from './components/Navbar'
import Web3 from 'web3';
//import ethers from ethers;
import Tether from '../../artifacts/contracts/Tether.sol/Tether.json';
import RWD from '../../artifacts/contracts/RWD.sol/RWD.json';
import DecentralBank from '../../artifacts/contracts/DecentralBank.sol/DecentralBank.json';
 import Main from './components/Main';

const TETHER_CONTRACT_ADDRESS = "0xAC7c3D5ccF756194d4DF99cE96aebd3DA72D5ff0";
const RWD_CONTRACT_ADDRESS = "0xEB4fcC289A74aA37beA863Bb827ca290Af418eef";
const DECENTRAL_CONTRACT_ADDRESS = "0x307430C2f8e057c9c8465A56A23300B0AedB7695";
const ERC20_CONTRACT_ADDRESS = "0x0acBae1C6837c60fC08322fA92DcBd0CF84CC810";


class App extends Component {

  // Runs automatically when component loads
  async UNSAFE_componentWillMount() {
      await this.loadWeb3();
      await this.loadBlockchainData();
  }

  // loads Metamask
  async loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    } else {
        window.alert('No Ethereum browser detected! Please install MetaMask.')
    }
  }

  // Loads accou ts and set state
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    this.setState({account: accounts[0]});

    web3.eth.getBlockNumber().then((result) => {
        console.log("Latest Ethereum Block is ", result)
    })

    const networkId = await web3.eth.net.getId();
    console.log(networkId, 'NetworkId')

    // Load Tether contract
    const tether = new web3.eth.Contract(Tether.abi, TETHER_CONTRACT_ADDRESS)
    this.setState({tether: tether})
    
    let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
    this.setState({tetherBalance: tetherBalance.toString()})
    console.log({balance: tetherBalance});

    // Load RWD contract
    const rwd = new web3.eth.Contract(RWD.abi, RWD_CONTRACT_ADDRESS)
    this.setState({rwd: rwd})
    
    let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
    this.setState({rwdBalance: rwdBalance.toString()})
    console.log({balance: rwdBalance});

    // Load Decentral Bank contract
    const decentralBank = new web3.eth.Contract(DecentralBank.abi, DECENTRAL_CONTRACT_ADDRESS)
    this.setState({decentralBank: decentralBank})
    
    let owner = await decentralBank.methods.owner.call();
    let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();

    this.setState({stakingBalance: stakingBalance.toString()});
    console.log({owner: owner.toString()});
    console.log({StakingBalance: stakingBalance});

    this.setState({loading: 'false'});
}

// Two functions one that stakes and one unstakes
//  leverage our decentralBank contract - deposit and unstaking
// ALL of this for staking
// depositTokens transform ....
// function approve transaction hash --------
// STAKING FUNCTION ?? >> decentralBank.depositTokes()


// staking function 
stakeTokens = async (amount) => {
  this.setState({ loading: true })

  try {
    await this.state.tether.methods
      .approve(this.state.decentralBank._address, amount)
      .send({ from: this.state.account })

    await this.state.decentralBank.methods
      .depositTokens(amount)
      .send({ from: this.state.account })

    this.setState({ loading: false })
  } catch (error) {
    console.error(error)
    this.setState({ loading: false })
  }
}

// Unstaking function
unstakeTokens = async () => {
  this.setState({ loading: true })

  try {
    await     this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account})
    this.setState({ loading: false })
  } catch (error) {
    console.error(error)
    this.setState({ loading: false })
  }
}



  constructor(props) {
    super(props) 
      this.state = {
        account: '0x01234',
        tether: {},
        rwd: {},
        decentralBank: {},
        tetherBalance: '0',
        rwdBalance: '0',
        stakingBalance: '0',
        loading: true
      }
  }

  // Our code goes here
  render() {
  //   let content
    
  //   if (this.state.loading) {
  //   content = (
  //     <p
  //       id="loader"
  //       className="text-center"
  //       style={{ margin: "30px" }}
  //     >
  //       LOADING PLEASE...
  //     </p>
  //   )
  // } else {
  //   content = <Main />
  // }
  return (
    <>
      <Navbar account={this.state.account} />

      <div className="container-fluid app-body mt-4">
        <div className="row justify-content-center">
          <main
            role="main"
            className="col-lg-11 col-md-8 col-sm-12"
          >
            <Main 
            tetherBalance={this.state.tetherBalance}
            rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            />
          </main>
        </div>
      </div>
    </>
  )
}


}

export default App;

// HTML is the markup language for writing basic text and websites
// CSS - styles the websites (colors, fonts, sizes)
// Javascript - allows the websites to be dynamic
