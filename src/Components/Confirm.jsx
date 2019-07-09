import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, message, Steps, Icon, Col, Spin } from 'antd'
import Logo from '../Components/Logo'
import { Link } from 'react-router-dom'

const Step = Steps.Step

class Confirm extends Component {
    constructor() {
        super();
        this.state = {
            spinter: false,
            buttonFu: <Button
                style={{ borderRadius: "20px" }}
                size="large"
                type="primary" block onClick={this.Confirm}><Icon type="save" style={{ fontSize: "23px" }} />ยืนยัน
             </Button>
        }
    }

    Confirm = () => {
        this.setState({
            spinter: true
        })
        fetch("http://183.88.219.85:7078/appoint/appointing.php", {
            method: "POST",
            body: JSON.stringify({
                person: this.props.person,
                service: this.props.service
            })
        })
            .then(res => res.json())
            .then(res => {
                let stat = res.map(a => a.stat).toString(),
                    mess = res.map(a => a.mess).toString()
                if (stat === "0") {
                    message.error(mess)
                    this.setState({
                        spinter: false
                    })
                }
                else {
                    this.setState({
                        spinter: false,
                        buttonFu: <Button
                            style={{ borderRadius: "20px" }}
                            size="large"
                            type="danger" block onClick={this.Back}><Link to={`/?lineId=${this.props.person.map(a => a.line).toString()}`} ><Icon type="arrow-left" style={{ fontSize: "18px" }} />กลับหน้าแรก</Link>
                        </Button>
                    })
                    message.success(mess)
                    fetch("https://mophconnect.go.th/api/queue", {
                        method: "POST",
                        body: JSON.stringify({
                            userId: this.props.person.map(a => a.line).toString(),
                            hospitalName: "โรงพยาบาลสามร้อยยอด",
                            origin: "กระทรวงสาธารณสุข",
                            queueNumber: this.props.service.map(a => a.servicePoint).toString() + " คิวที่ " + this.props.service.map(a => a.serviceTime).toString(),
                            patientName: this.props.person.map(a => a.prefix + " " + a.fname + " " + a.lname).toString(),
                            appointmentDate: this.props.service.map(a => a.serviceDate).toString(),
                            appointmentTime: "เวลานัดหมาย " + this.props.service.map(a => a.serviceTime) + "น. กรุณามาก่อนนัด20นาที",
                            detailsLink: "http://www.samroiyodhospital.go.th/",
                            currentQueueLink: "http://www.samroiyodhospital.go.th/"
                        })
                    })
                }
            })
    }

    render() {
        return (<div>

            <div>
                <Logo />
            </div>

            <Spin spinning={this.state.spinter}>

                <Steps progressDot current={2}>
                    <Step title="ลงทะเบียน" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="idcard" theme="" />} />
                    <Step title="ทำรายการนัดหมาย" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="solution" theme="" />} />
                    <Step title="บันทึก" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="file-done" theme="" />} />
                </Steps>
                <br />
                <Card>
                    <Col lg={{ span: 20, offset: 2 }}>
                        <Card style={{ borderRadius: "20px", fontSize: "15px" }}>
                            <div style={{ textAlign: "center" }}>
                                การนัดหมาย
                        </div>
                            {this.props.person.map(a => (<div>
                                <h3>ชื่อ: {a.prefix} {a.fname} {a.lname}</h3>
                                <h3>เลขประจำตัวประชาชน: {a.cid} </h3>
                                <h3>อายุ: {a.age}</h3>
                                <h3>สิทธิ์: {a.plans}</h3>
                            </div>))}
                            {this.props.service.map(b => (<div>
                                <h3>วันที่นัด: {b.serviceDate} เวลา {b.serviceTime} น.</h3>
                                <h3>จุดนัด: {b.servicePoint}</h3>
                                <h3>บริการ: {b.serviceName}</h3>
                            </div>))}
                            {this.state.buttonFu}
                            <br />
                            <br />
                            <Button
                                style={{ borderRadius: "20px" }}
                                size="large"
                                type="danger" block onClick={this.Back}><Link to="/Appoint" ><Icon type="close" style={{ fontSize: "23px" }} /> ยกเลิก</Link>
                            </Button>
                        </Card>
                    </Col>
                </Card>
            </Spin>
        </div>)
    }
}

const DataStore = state => {
    return {
        person: state.person,
        service: state.service
    }
}

export default connect(DataStore)(Confirm)