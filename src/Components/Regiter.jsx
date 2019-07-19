import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { DatePicker, Button, Input, Modal, message, Card, Col, Icon, Steps } from 'antd'
import Logo from './Logo'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Step = Steps.Step;
class Regiter extends Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            birthDate: "",
            dataPerson: [],
            line: ""
        }
    }

    componentDidMount() {
        let appointLineId = window.location.search.split("?lineId=")[1]
        this.setState({
            line: appointLineId
        })
    }
    dateChange = (date, dateStr) => {
        let dates = dateStr,
            day = dates.split("-")[1] + "-" + dates.split("-")[2]
        dates = dates.split("-")[0]
        dates = dates++ + 543 + "-" + day
        this.setState({
            birthDate: dates
        })
    }

    Searth = () => {
        let birthDay = this.state.birthDate,
            cid = document.getElementById("cid").value,
            phone = document.getElementById("phone").value

        if (birthDay === "" || cid === "" || phone === "") {
            message.warning("กรอกข้อมูลให้ครบ")
        } else {
            fetch("http://183.88.219.85:7078/appoint/person.php", {
                method: "POST",
                body: JSON.stringify({
                    birthDay: birthDay,
                    cid: cid,
                    phone: phone
                })
            }).then(res => res.json())
                .then(res => {
                    let stat = res.map(a => a.stat).toString()
                    if (stat === "0") {
                        message.warning(res.map(a => a.mess))
                    } else {
                        let dataPerson = [{
                            hn: res.map(a => a.patient_hn).toString(),
                            prefix: res.map(a => a.patient_prefix_description).toString(),
                            fname: res.map(a => a.patient_firstname).toString(),
                            lname: res.map(a => a.patient_lastname).toString(),
                            age: res.map(a => a.age).toString(),
                            plans: res.map(a => a.contract_plans_description).toString(),
                            line: this.state.line,
                            phone: phone,
                            sex: res.map(a => a.sex_description).toString(),
                            cid: res.map(a => a.patient_pid).toString(),
                            birth: res.map(a => a.patient_birthday).toString()
                        }]
                        //console.log(dataPerson)
                        this.setState({
                            visible: true,
                            dataPerson: dataPerson
                        })
                    }

                })
        }
    }

    Confirm = () => {
        this.props.dispatch({
            type: "claerPerson"
        })
        this.props.dispatch({
            type: "person",
            dataPerson: this.state.dataPerson
        })
        this.setState({
            visible: true
        })
    }

    Close = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <div>
                <Logo />
                <Steps progressDot current={0}>
                    <Step title="ลงทะเบียน" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="idcard" />} />
                    <Step title="ทำรายการนัดหมาย" description={<Icon style={{ fontSize: "25px" }} type="solution" />} />
                    <Step title="บันทึก" description={<Icon style={{ fontSize: "25px" }} type="file-done" />} />
                </Steps>
                <br />
                <Card>
                    <Col lg={{ span: 20, offset: 2 }}>
                        <Card style={{ borderRadius: "10px", borderColor: "#00b300" }}>
                            <div style={{ textAlign: "center" }}>
                                <h2>ค้นหาข้อมูล</h2>
                            </div>
                            <br />
                            <h3>วันเกิด:</h3>
                            <DatePicker
                                style={{ width: "100%" }}
                                onChange={this.dateChange}
                                size={"large"}
                                placeholder={"คศ-เดือน-วัน"}
                            />
                            <br />
                            <br />
                            <h3>เลขบัตรประชาชน:</h3>
                            <Input size="large" id="cid" placeholder="กรอกเลขประจำตัวประชาชน" maxLength="13" />
                            <br />
                            <br />
                            <h3>เบอร์ติดต่อ:</h3>
                            <Input id="phone" placeholder="กรอกหมายเลขโทรศัพ" size="large" />
                            <br />
                            <br />
                            <Button size="large" block onClick={this.Searth} type={"primary"}><Icon type="zoom-in" />ค้นหา</Button>
                        </Card>
                        <Modal
                            visible={this.state.visible}
                            footer={null}
                            closable={null}
                            mask={true}
                        >
                            <table style={{ textAlign: "", width: "100%", borderInlineStyle: "groove" }} >
                                <tr style={{ textAlign: "center" }}>
                                    <th colSpan="2"><h2>ข้อมูลผู้รับบริการ</h2></th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td><h3>ชื่อ</h3></td>
                                    <td>{this.state.dataPerson.map(a => (<div>
                                        <h3>{a.prefix} {a.fname} {a.lname}</h3>
                                    </div>))}</td>
                                </tr>
                                <tr>
                                    <td><h3>เลขบัตรประชาชน</h3></td>
                                    <td><h3>{this.state.dataPerson.map(a => a.cid)}</h3></td>
                                </tr>
                                <tr>
                                    <td><h3>วันเกิด</h3></td>
                                    <td><h3>{this.state.dataPerson.map(a => a.birth)}</h3></td>
                                </tr>
                                <tr>
                                    <td><h3>สิทธิ์</h3></td>
                                    <td><h3>{this.state.dataPerson.map(a => a.plans)}</h3></td>
                                </tr>
                            </table>
                            <br />
                            <Button size={"large"} type={"primary"} block onClick={this.Confirm}><Link to="/Appoint"><Icon type="check" /> ยืนยัน</Link></Button>
                            <br />
                            <br />
                            <Button size={"large"} type={"default"} block onClick={this.Close}><Icon type="close" />ยกเลิก</Button>
                        </Modal>
                    </Col>
                </Card>
            </div>)
    }
}

export default connect()(Regiter)