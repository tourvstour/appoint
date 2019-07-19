import React, { Component } from 'react'
import { Select, Button, Card, message } from 'antd'
import { CookiesProvider, withCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import Login from './Login'
import Dent from '../Components/Dent'
import MassageAdmin from '../Components/MassageAdmin'

const { Option } = Select;
class Monitor extends Component {
    constructor() {
        super()
        this.state = {
            user: [],
            point: [],
            redirects: <html></html>,
            components: <div>เลือกจุดบริการ</div>
        }
    }

    componentDidMount() {
        fetch("http://183.88.219.85:7078/appoint/service_point.php")
            .then(res1 => res1.json())
            .then(res1 => {
                this.setState({
                    point: res1
                })
            })
        const { cookies } = this.props
        //console.log(cookie)
        let userName = cookies.get('user'),
            passWord = cookies.get('pass')

        if (userName === undefined || passWord === undefined) {
            //console.log(userName)
            this.setState({
                redirects: <Redirect to="/login" />
            })
        }
        else {
            fetch("http://183.88.219.85:7078/appoint/login.php", {
                method: "POST",
                body: JSON.stringify({
                    user: userName,
                    pass: passWord
                })
            }).then(res => res.json())
                .then(res => {
                    //console.log(res)
                    let stat = res.map(a => a.stat).toString(),
                        point = res.map(a => a.point).toString()
                    this.setState({
                        user: res
                    })
                    if (stat === "1") {
                        let prov = res.map(a => a.person_firstname) + " " + res.map(a => a.person_lastname)
                        cookies.set('provider', prov)
                    } else {
                        message.warning("usernameหรือpasswordไม่ถูกต้อง")
                    }
                })
        }
    }

    selectPoint = (e) => {
        let servicePoint = e.toString()

        switch (servicePoint) {
            case "1":
                this.setState({
                    components: <div><Dent /></div>
                })
                break
            case "2":
                this.setState({
                    components: <div><MassageAdmin /></div>
                })
                break
            default:
                break
        }
    }

    logOut = () => {
        const { cookies } = this.props
        cookies.remove('user')
        cookies.remove('pass')
        let userName = cookies.get('user'),
            passWord = cookies.get('pass')

        if (userName === undefined || passWord === undefined) {
            message.success("LOGOUT SUCCESS")
            this.setState({
                redirects: <Redirect to="/login" />
            })
        }
    }
    render() {
        return (
            <div>
                <Card style={{ borderRadius: "10px" }}>
                    <div style={{ textAlign: "center" }}>
                        <h1>ระบบนัดออนไลน์ โรงพยาบาลสามร้อยยอด</h1>
                        <h3>เลือกจุดบริการ:{" "}
                            <Select
                                style={{ width: "80%" }}
                                onSelect={this.selectPoint}
                                placeholder={"เลือกจุดบริการ"}
                            >
                                {this.state.point.map(a => (
                                    <Option value={a.point_id}>{a.point_name}</Option>
                                ))}

                            </Select>
                        </h3>
                        <div style={{ textAlign: "right" }}>
                            <h3>{this.state.user.map(a => (a.person_firstname + " " + a.person_lastname))}{" "}
                                <Button type={"danger"} onClick={this.logOut}>Logout</Button></h3>
                        </div>
                    </div>
                    {this.state.redirects}
                </Card>
                <br />
                <Card style={{ borderRadius: "10px" }}>
                    {this.state.components}
                </Card>
            </div>
        )
    }
}

export default withCookies(Monitor)