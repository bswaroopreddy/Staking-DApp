import React, {Component} from "react";
import tether from "../assets/token-logo.png"

class Main extends Component {
  render() {
    console.log(this.props.stakingBalance)
    console.log(this.props.tetherBalance)
    console.log(this.props.rwdBalance)
    return (
      <div id="content" className="mt-4">

        <table className="table table-bordered text-center mb-4">
          <thead className="table-light">
            <tr>
              <th>Staking Balance</th>
              <th>Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.props.stakingBalance
                    ? window.web3.utils.fromWei(
                    this.props.stakingBalance.toString(),
                   "ether"
                    )
                : "0"}{" "}
                 USDT</td>
              <td> {this.props.stakingBalance
                    ? window.web3.utils.fromWei(
                    this.props.rwdBalance.toString(),
                      "ether"
                      )
                    : "0"}{" "}  RWD</td>
            </tr>
          </tbody>
        </table>

<div className="card shadow-sm">
  <form
    onSubmit={(event) => {
      event.preventDefault()

      let amount = this.input.value
      amount = window.web3.utils.toWei(amount, "ether")

      this.props.stakeTokens(amount)
    }}
    className="card-body"
  >
    <div className="d-flex justify-content-between mb-3">
      <strong>Stake Tokens</strong>
      <span>
        Balance:{" "}
        {this.props.tetherBalance
          ? window.web3.utils.fromWei(
              this.props.tetherBalance.toString(),
              "ether"
            )
          : "0"}
      </span>
    </div>

    <div className="input-group mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="0"
        required
        ref={(input) => { this.input = input }}
      />
      <span className="input-group-text">
        <img src={tether} alt="tether" style={{ width: "20px" }} />
        USDT
      </span>
    </div>

    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
      DEPOSIT
    </button>

    <button type="submit" 
            onClick={(event) => {
              event.preventDefault()
              this.props.unstakeTokens()
            }}
            className="btn btn-primary btn-lg w-100 mb-3">

      WITHDRAW
    </button>
  </form>
</div>


      </div>
    )
  }
}

export default Main;
