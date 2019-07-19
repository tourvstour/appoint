import React, { Component } from 'react'
import { Input, Button, Card, message, Col } from 'antd'
import { CookiesProvider, withCookies } from 'react-cookie'
import CryptoJS from 'crypto-js'
import Logo from '../favicon.ico'
import { Redirect } from 'react-router-dom';
class Login extends Component {
    constructor() {
        super()
        this.state = {
            Redirects: <html></html>
        }
    }
    Login = () => {
        const { cookies } = this.props;
        let userName = document.getElementById("user").value,
            passWord = document.getElementById("pass").value

        userName = CryptoJS.enc.Utf8.parse(userName)
        userName = CryptoJS.enc.Base64.stringify(userName)
        passWord = CryptoJS.enc.Utf8.parse(passWord)
        passWord = CryptoJS.enc.Base64.stringify(passWord)
        cookies.set('user', userName)
        cookies.set('pass', passWord)

        fetch("http://183.88.219.85:7078/appoint/login.php", {
            method: "POST",
            body: JSON.stringify({
                user: userName,
                pass: passWord
            })
        }).then(res => res.json())
            .then(res => {
                //console.log(res)
                let stat = res.map(a => a.stat).toString()
                if (stat === "1") {

                    message.success("LOGIN SUCCESS")
                    this.setState({
                        Redirects: <Redirect to="monitor" />
                    })

                } else {
                    message.warning("usernameหรือpasswordไม่ถูกต้อง")
                }
            })

    }

    Logout = () => {
        const { cookies } = this.props
        cookies.remove('user')
        cookies.remove('pass')
    }

    render() {
        return (
            <div style={{ padding: "70px" }}>
                <Col lg={{ span: "10", offset: "7" }}>
                    <Card style={{ borderRadius: "10px" }}>
                        <div style={{ textAlign: "center" }}>
                            <img src={Logo} width="200px" />
                        </div>
                        <br />
                        <Input id={"user"} placeholder={"UserName"} />
                        <br />
                        <br />
                        <Input id={"pass"} type={"password"} placeholder={"Password"} />
                        <br />
                        <br />
                        <div style={{ textAlign: "center" }}>
                            <Button onClick={this.Login} style={{ width: "90px", backgroundColor: "green", color: "white" }}>LOGIN</Button>
                            {" "}
                            <Button onClick={this.Logout} style={{ width: "90px" }}>LOGOUT</Button>
                        </div>

                    </Card>
                </Col>
                {this.state.Redirects}
            </div>
        )
    }
}

export default (withCookies(Login))