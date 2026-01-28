import React, {Component} from "react";
import bank from "../assets/bank.png"

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark fixed-top shadow px-3" style={{backgroundColor:'blue', height:'50px'}}>
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" style={{color:'white'}}>
             <img src={bank} width='50' height='30' className="d-inline-black align-top" alt='bank'/> &nbsp; DApp Yield Staking (Decentralized Banking)
        </a>

        <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-block">
                <small style={{color:'white'}}>ACCOUNT NUMBER: {this.props.account}
                </small>
            </li>
        </ul>
      </nav>     
   )
  }
}

export default Navbar;
