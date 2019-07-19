import React, { Component } from 'react'
import {  withCookies } from 'react-cookie'
import { Card, Modal, Button,  message, Select, DatePicker, Table, Tag, Popconfirm } from 'antd'
import CryptoJS from 'crypto-js'
import Logo from '../favicon.ico'
import moment from 'moment'
const { Option } = Select;
var date = new Date()
date = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
class Dent extends Component {
    constructor() {
        super();
        this.state = {
            userLogin: "",
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
        const { cookies } = this.props
        let user = cookies.get('provider')
        console.log(user)
        this.setState({
            selectDate: date,
            userLogin: user
        })
        fetch("http://183.88.219.85:7078/appoint/view_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                dates: date,
                point: 1
            })
        }).then(view => view.json())
            .then(view => {
                this.setState({
                    view: view
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
                    point: 1
                })
            }).then(view => view.json())
                .then(view => {
                    this.setState({
                        view: view
                    })
                })
        }
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
            userLoggin = this.state.userLogin
        if (newTime === "" || newDate === "" || updateId === "" || userLoggin === "") {
            message.error("แก้ไขข้อมูลผิดพลาด")
            console.log(newDate, newTime, updateId, userLoggin)
        }
        else {
            fetch("http://183.88.219.85:7078/appoint/update_service.php", {
                method: "POST",
                body: JSON.stringify({
                    date: newDate,
                    time: newTime,
                    id: updateId,
                    user: userLoggin
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
        console.log(newDate, newTime, updateId)
    }

    modalCancal = () => {
        this.setState({
            modal: false
        })
    }

    confirmDel = (e) => {
        console.log(e)
        let userLoggin = this.state.userLogin
        fetch("http://183.88.219.85:7078/appoint/cancel_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                id: e.toString(),
                user: userLoggin
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
        return (
            <div>
                <Card>
                    <h1 style={{ textAlign: "center" }}>จุดบริการทันตกรรม</h1>
                    <div style={{ textAlign: "center" }}>
                        <h3>
                            วันที่ :{" "}
                            <DatePicker
                                value={moment(this.state.selectDate)}
                                style={{ width: 'auto' }}
                                onChange={this.dateChange}
                                cancelText={true} />
                        </h3>
                    </div>
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
        )
    }

}
export default withCookies(Dent)