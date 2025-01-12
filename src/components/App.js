import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Web3 from "web3";
import dBank from "../abis/dBank.json";
import Token from "../abis/Token.json";
import dbank from "../dbank.png";
import "./App.css";

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: "undefined",
            account: "",
            token: null,
            dbank: null,
            balance: 0,
            dBankAddress: null,
        };
    }

    async componentWillMount() {
        await this.loadBlockchainData(this.props.dispatch);
    }

    async loadBlockchainData(dispatch) {
        //check if MetaMask exists
        if (typeof window.ethereum !== "undefined") {
            //assign to values to variables: web3, netId, accounts
            const web3 = new Web3(window.ethereum);
            const netId = await web3.eth.net.getId();
            const accounts = await web3.eth.getAccounts();
            if (typeof accounts[0] !== "undefined") {
                const balance = await web3.eth.getBalance(accounts[0]);
                this.setState({
                    account: accounts[0],
                    balance,
                    web3,
                });
            } else {
                alert("Please log in with MetaMask");
                return;
            }
            //check if account is detected, then load balance&setStates, elsepush alert

            //in try block load contracts
            try {
                const token = new web3.eth.Contract(
                    Token.abi,
                    Token.networks[netId].address
                );
                const dBankAddress = dBank.networks[netId].address;
                const dbank = new web3.eth.Contract(
                    dBank.abi,
                    dBank.networks[netId].address
                );
                this.setState({
                    token,
                    dbank,
                    dBankAddress,
                });
            } catch (e) {
                console.log("Error", e);
                alert("Contracts are not deployed to current network");
            }
        } else {
            //if MetaMask not exists push alert
            alert("Please install MetaMask Extension");
        }
    }

    async deposit(amount) {
        //check if this.state.dbank is ok
        //in try block call dBank deposit();
        if (typeof this.state.dbank !== "undefined") {
            try {
                await this.state.dbank.methods.deposit().send({
                    value: amount.toString(),
                    from: this.state.account,
                });
            } catch (error) {
                console.log("Error with deposit: ", error);
            }
        }
    }

    async withdraw(e) {
        //prevent button from default click
        //check if this.state.dbank is ok
        //in try block call dBank withdraw();
        e.preventDefault();
        if (typeof this.state.dbank !== "undefined") {
            try {
                await this.state.dbank.methods.withdraw().send({
                    from: this.state.account,
                });
            } catch (error) {
                console.log("Error with withdraw: ", error);
            }
        }
    }

    render() {
        return (
            <div className="text-monospace">
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="http://www.dappuniversity.com/bootcamp"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={dbank}
                            className="App-logo"
                            alt="logo"
                            height="32"
                        />
                        <b>dBank</b>
                    </a>
                </nav>
                <div className="container-fluid mt-5 text-center">
                    <br></br>
                    <h1>Welcome to dBank!</h1>
                    <h2>Your address is {this.state.account}</h2>
                    <br></br>
                    <div className="row">
                        <main
                            role="main"
                            className="col-lg-12 d-flex text-center"
                        >
                            <div className="content mr-auto ml-auto">
                                <Tabs
                                    defaultActiveKey="profile"
                                    id="uncontrolled-tab-example"
                                >
                                    <Tab eventKey="deposit" title="Deposit">
                                        <div>
                                            <br></br>
                                            How much do you want to deposit?
                                            <br></br>
                                            (min. amount is 0.01 ETH)
                                            <br></br>
                                            (1 deposit is possible at the time)
                                            <br></br>
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    let amount = this
                                                        .depositAmount.value;
                                                    amount = amount * 10 ** 18; //convert to wei
                                                    this.deposit(amount);
                                                }}
                                            >
                                                <div className="form-group mr-sm-2">
                                                    <br></br>
                                                    <input
                                                        id="depositAmount"
                                                        step="0.01"
                                                        type="number"
                                                        ref={(input) => {
                                                            this.depositAmount = input;
                                                        }}
                                                        className="form-control form-control-md"
                                                        placeholder="amount..."
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                >
                                                    DEPOSIT
                                                </button>
                                            </form>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="withdraw" title="Withdraw">
                                        <br></br>
                                        Do you want to withdraw + take interest?
                                        <br></br>
                                        <br></br>
                                        <div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                onClick={(e) =>
                                                    this.withdraw(e)
                                                }
                                            >
                                                WITHDRAW
                                            </button>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
