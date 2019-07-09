import React, { Component } from 'react'
import { CookiesProvider, withCookies } from 'react-cookie'
import { Card, Modal, Input, Button, Col, message, Select, DatePicker, Table, Tag, Popconfirm } from 'antd'
import CryptoJS from 'crypto-js'
import Logo from '../favicon.ico'
import moment from 'moment'
const { Option } = Select;
var date = new Date()
date = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
class Monitor extends Component {
    constructor() {
        super();
        this.state = {
            dateEdit: "",
            timeEdit: "",
            modal: false,
            time: [],
            point: [],
            dataEdit: [],
            empoye: [],
            checkLogin: "",
            selectDate: "",
            selectPoint: [],
            view: [],
            colums: [
                {
                    title: "วันที่รับบริการ",
                    dataIndex: "service_date"
                },
                {
                    title: "เวลานัด",
                    dataIndex: "time_point_name"
                },
                {
                    title: "HN",
                    dataIndex: "service_hn"
                },
                {
                    title: "ชื่อ-สกุล",
                    dataIndex: "pname"
                },
                {
                    title: "อายุ",
                    dataIndex: "person_age"
                },
                {
                    title: "เบอร์ติดต่อ",
                    dataIndex: "person_phone"
                },
                {
                    title: "จุดรับบริการ",
                    dataIndex: "point_name"
                },
                {
                    title: "บริการ",
                    dataIndex: "service_name_order"
                },
                {
                    title: "แก้ไข",
                    dataIndex: "service_id",
                    render: service_id => (<Button onClick={() => this.Edits(service_id)} style={{ backgroundColor: "#ff8080" }} type="danger"> แก้ไข</Button>)
                }
            ],
            editColum: [
                {
                    title: "HN",
                    dataIndex: "service_hn"
                },
                {
                    title: "ชื่อ",
                    dataIndex: "pname"
                },
                {
                    title: "จุดนัด",
                    dataIndex: "point_name"
                },
                {
                    title: "วันที่นัด",
                    dataIndex: "service_date",
                    render: () => (<DatePicker
                        style={{ width: 'auto' }}
                        onChange={this.dateEdit} />)
                },
                {
                    title: "เวลานัด",
                    dataIndex: "",
                    render: () => (<Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a point"
                        optionFilterProp="children"
                        onSelect={(e) => this.timeEdit(e)}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.state.time.map(a => (<Option value={a.time_point_id}>{a.time_point_name}</Option>))}
                    </Select>)
                },
                {
                    title: "ลบ",
                    dataIndex: "service_id",
                    render: (service_id) => (
                        <Popconfirm
                            title="ยืนยันการยกเลิก?"
                            onConfirm={() => this.confirmDel(service_id)}
                            onCancel={this.confirmCancel}
                            placement="leftTop"
                        >
                            <Tag color="volcano">ยกเลิกนัด</Tag>
                        </Popconfirm>
                    )
                }
            ]
        }
    }

    componentDidMount() {
        //console.log(date)
        this.setState({
            selectDate: date
        })
        const { cookies } = this.props;
        if (cookies.get('user') === undefined && cookies.get('pass') === undefined) {
            console.log("u")
        }
        else {
            fetch("http://183.88.219.85:7078/appoint/login.php", {
                method: "POST",
                body: JSON.stringify({
                    user: cookies.get('user'),
                    pass: cookies.get('pass')
                })
            })
                .then(res => res.json())
                .then(res => {
                    let checkLogin = res.map(a => a.stat).toString()
                    this.setState({
                        checkLogin: checkLogin,
                        empoye: res,
                        selectPoint: Number(res.map(a => a.point))
                    })
                })
            fetch("http://183.88.219.85:7078/appoint/service_point.php")
                .then(res1 => res1.json())
                .then(res1 => {
                    this.setState({
                        point: res1
                    })
                })
        }
    }

    componentWillReceiveProps() {
        console.log(this.props)
        const { cookies } = this.props;
        //console.log(cookies)
        fetch("http://183.88.219.85:7078/appoint/login.php", {
            method: "POST",
            body: JSON.stringify({
                user: cookies.get('user'),
                pass: cookies.get('pass')
            })
        }).then(res => res.json())
            .then(res => {
                let checkLogin = res.map(a => a.stat).toString()
                console.log(checkLogin)
                this.setState({
                    checkLogin: checkLogin,
                    empoye: res,
                    selectPoint: Number(res.map(a => a.point))
                })
                fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
                    method: "POST",
                    body: JSON.stringify({
                        dates: this.state.selectDate,
                        point: this.state.selectPoint.toLocaleString()
                    })
                })
                    .then(view => view.json())
                    .then(view => {
                        this.setState({
                            view: view
                        })
                    })
            })
    }

    Login = () => {
        const { cookies } = this.props;
        cookies.remove('user')
        cookies.remove('pass')
        let user = document.getElementById('user').value,
            pass = document.getElementById('pass').value

        user = CryptoJS.enc.Utf8.parse(user)
        user = CryptoJS.enc.Base64.stringify(user)
        pass = CryptoJS.enc.Utf8.parse(pass)
        pass = CryptoJS.enc.Base64.stringify(pass)

        cookies.set('user', user)
        cookies.set('pass', pass)
        // console.log(this.props.cookies.cookies)

        fetch("http://183.88.219.85:7078/appoint/login.php", {
            method: "POST",
            body: JSON.stringify({
                user: user,
                pass: pass
            })
        })
            .then(res => res.json())
            .then(res => {
                let checkLogin = res.map(a => a.stat).toString()
                if (checkLogin === "1") {
                    message.success('success')
                    this.setState({
                        checkLogin: checkLogin,
                        empoye: res
                    })
                } else {
                    message.error('username or password')
                    this.setState({
                        checkLogin: checkLogin
                    })
                }
            })
        fetch("http://183.88.219.85:7078/appoint/service_point.php")
            .then(res1 => res1.json())
            .then(res1 => {
                this.setState({
                    point: res1
                })
            })
    }

    delCook = () => {
        const { cookies } = this.props;
        cookies.remove('user')
        cookies.remove('pass')
    }

    dateChange = (a, b) => {
        //console.log(b)
        if (b === "") {

        } else {
            this.setState({
                selectDate: b
            })
            fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
                method: "POST",
                body: JSON.stringify({
                    dates: b,
                    point: this.state.selectPoint.toString()
                })
            }).then(view => view.json())
                .then(view => {
                    this.setState({
                        view: view
                    })
                })
        }
    }

    pointChange = (e) => {
        //console.log(e)
        this.setState({
            selectPoint: e
        })
        fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                dates: this.state.selectDate,
                point: e
            })
        }).then(view => view.json())
            .then(view => {
                this.setState({
                    view: view
                })
            })
    }

    Edits = (e) => {
        console.log(e)
        this.setState({
            modal: true
        })
        fetch("http://183.88.219.85:7078/appoint/view_edit.php", {
            method: "POST",
            body: JSON.stringify({
                id: e
            })
        })
            .then(view_edit => view_edit.json())
            .then(view_edit => {
                this.setState({
                    dataEdit: view_edit
                })
            })
    }

    dateEdit = (a, b) => {
        this.setState({
            dateEdit: b
        })
        fetch("http://183.88.219.85:7078/appoint/select_time_edit.php", {
            method: "POST",
            body: JSON.stringify({
                dateEdit: b,
                pointEdit: this.state.dataEdit.map(a => a.service_pont).toString()
            })
        })
            .then(time => time.json())
            .then(time => {
                this.setState({
                    time: time
                })
            })
    }

    timeEdit = (e) => {
        console.log(e)
        this.setState({
            timeEdit: e
        })
    }

    modalOk = () => {
        let newTime = this.state.timeEdit,
            newDate = this.state.dateEdit,
            updateId = this.state.dataEdit.map(a => a.service_id).toString(),
            userUpdate = this.state.empoye.map(a => (a.person_firstname) + " " + (a.person_lastname)).toString()
        if (newTime === "" || newDate === "" || updateId === "" || userUpdate === "") {
            message.error("แก้ไขข้อมูลผิดพลาด")
            console.log(newDate, newTime, updateId, userUpdate)
        }
        else {
            fetch("http://183.88.219.85:7078/appoint/update_service.php", {
                method: "POST",
                body: JSON.stringify({
                    date: newDate,
                    time: newTime,
                    id: updateId,
                    user: userUpdate
                })
            })
                .then(() => (
                    fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
                        method: "POST",
                        body: JSON.stringify({
                            dates: this.state.selectDate,
                            point: this.state.selectPoint
                        })
                    })
                        .then(view => view.json())
                        .then(view => {
                            this.setState({
                                view: view
                            })
                        })
                ))
                .then(() => {
                    message.success("UPDATE SUCCESS")
                    this.setState({
                        dateEdit: "",
                        timeEdit: "",
                        time: []
                    })
                })
        }
        this.setState({
            modal: false
        })
        console.log(newDate, newTime, updateId, userUpdate)
    }

    modalCancal = () => {
        this.setState({
            modal: false
        })
    }

    confirmDel = (e) => {
        console.log(e)
        let userUpdate = this.state.empoye.map(a => (a.person_firstname) + " " + (a.person_lastname)).toString()
        fetch("http://183.88.219.85:7078/appoint/cancel_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                id: e.toString(),
                user: userUpdate
            })
        })
            .then(() => (
                fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
                    method: "POST",
                    body: JSON.stringify({
                        dates: this.state.selectDate,
                        point: this.state.selectPoint
                    })
                })
                    .then(view => view.json())
                    .then(view => {
                        this.setState({
                            view: view
                        })
                    })
            ))
            .then(() => {
                message.success("ยกเลิกนัดสำเร็จ")
                this.setState({
                    dateEdit: "",
                    timeEdit: "",
                    time: [],
                    modal: false
                })
            })
    }

    render() {
        let checkLogin = this.state.checkLogin,
            points = this.state.point
        console.log(points)
        if (checkLogin === "" || checkLogin === "0") {
            return (
                <CookiesProvider>
                    <div>
                        <Col lg={{ span: 10, offset: 7 }} style={{ padding: "50px 0px 0px 0px" }}>
                            <div style={{ textAlign: "center" }}>
                                <img src={Logo} width="200px" />
                            </div>
                            <Card>
                                <h1 style={{ textAlign: "center" }}>ระบบนัดออนไลน์</h1>
                                <h2>UserName:</h2>
                                <Input id="user" />
                                <h2>Password:</h2>
                                <Input id="pass" type="password" />
                                <br />
                                <br />
                                <Button block size="large" type="primary" onClick={this.Login} >LOGIN</Button>
                                <br />
                                <br />
                                <Button block size="large" type="danger" onClick={this.delCook} >LOGOUT</Button>
                            </Card>
                        </Col>
                    </div>
                </CookiesProvider>
            )
        }
        else if (checkLogin === "1") {
            return (
                <div>
                    <CookiesProvider>
                        <div>
                            <Card >
                                {this.state.empoye.map(a => (
                                    <div>

                                        <Col lg={{ span: 24 }}>
                                            <Col lg={{ span: 19 }}>
                                                <h1 style={{ textAlign: "left" }}>ระบบนัดออนไลน์</h1>
                                            </Col>
                                            <Col lg={{ span: 5 }}>
                                                <h3 style={{ textAlign: "right" }}>{`${a.person_firstname} ${a.person_lastname} `} <Button style={{ width: "50" }} type="danger" onClick={this.delCook} >LOGOUT</Button></h3>
                                            </Col>
                                        </Col>
                                    </div>
                                ))}
                            </Card>

                            <Card>
                                <h1 style={{ textAlign: "center" }}>รายชื่อ</h1>
                                <h3>
                                    จุดบริการ :{" "}
                                    <Select
                                        showSearch
                                        style={{ width: 800 }}
                                        placeholder="Select a point"
                                        value={this.state.selectPoint}
                                        optionFilterProp="children"
                                        onChange={this.pointChange}
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.point.map(a => (
                                            <Option value={a.point_id}>{a.point_name}</Option>
                                        ))}
                                    </Select>
                                    {" "}
                                    วันที่ :{" "}
                                    <DatePicker
                                        value={moment(this.state.selectDate)}
                                        style={{ width: 'auto' }}
                                        onChange={this.dateChange}
                                        cancelText={true} />
                                </h3>
                            </Card>
                            <Table columns={this.state.colums} dataSource={this.state.view} />
                            <Modal
                                title="แก้ไข"
                                okText={"บันทึกการแก้ไข"}
                                cancelText={"ปิด"}
                                visible={this.state.modal}
                                onOk={this.modalOk}
                                onCancel={this.modalCancal}
                                width={"70%"}
                            >
                                <Table columns={this.state.editColum} dataSource={this.state.dataEdit} />
                            </Modal>
                        </div>
                    </CookiesProvider>
                </div>
            )
        }
    }
}

export default withCookies(Monitor)