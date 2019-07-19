import React, { Component } from 'react'
import { Steps, Icon, Card, Select, Col, DatePicker, Button, notification, Table, Modal, message } from 'antd'
import moment from 'moment'
import Logo from '../Components/Logo'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Option = Select.Option;
const Step = Steps.Step
const disabledDate = (cur) => {
    return cur < moment().add(+1, 'day') || cur > moment().add(+60, 'day')
}

class Massage extends Component {
    constructor() {
        super();
        this.state = {
            service: [],
            dateAppoint: [],
            docService: [],
            subService: [],
            selectTime: [],
            serviceModal: false,
            selectService: [],
            maxLength: "",
            Buttons: <Button block
                style={{ borderRadius: "20px" }}
                type={"default"}
                size={"large"}
                onClick={this.ButtonCheck}>
                <Icon type="scan" style={{ fontSize: "23px" }} /> ตรวจสอบ
    </Button>,
            column: [{
                title: 'ผู้ให้บริการ', dataIndex: 'docName'
            }, {
                title: "วันที่",
                dataIndex: "serviceDate"
            }],
            subColumn: [{
                title: 'เวลานัด', dataIndex: ''
            }, {
                title: "สถานะ",
                dataIndex: ""
            }]
        }
    }

    componentDidMount() {
        fetch("http://183.88.219.85:7078/appoint/service.php", {
            method: "POST",
            body: JSON.stringify({
                point: 2
            })
        }).then(res => res.json())
            .then(res => {
                this.setState({
                    service: res
                })
            })
    }

    changeDate = (e, a) => {
        try {
            let dayOff = e._d.getDay()
            fetch("http://183.88.219.85:7078/appoint/day_off.php", {
                method: "POST",
                body: JSON.stringify({
                    datec: a
                })
            })
                .then(res => res.json())
                .then(res => {
                    let dayOffSpacial = res.map(a => a.dayoff_date),
                        dayOffDesc = res.map(a => a.dayoff_name)
                    const openNotificationWithIcon = type => {
                        notification[type]({
                            duration: null,
                            message: 'ไม่สามารถเลือกวันหยุดราชการได้',
                            description: 'กรุณาเลือกวันนัดในวันทำการ',
                            btn: <Button onClick={() => notification.destroy()}>close</Button>
                        })
                    }
                    const dayOff_hospital = type => {
                        notification[type]({
                            duration: null,
                            message: "ไม่สามารถเลือกวันหยุดราชการได้",
                            description: dayOffSpacial + " " + dayOffDesc,
                            btn: <Button onClick={() => notification.destroy()}>close</Button>
                        })
                    }
                    if (dayOff === 0 || dayOff === 6) {
                        openNotificationWithIcon('warn')

                    }
                    else if (dayOffSpacial.length !== 0) {
                        dayOff_hospital('warning')
                    }
                    else {
                        this.setState({
                            dateAppoint: a
                        })

                        fetch("http://183.88.219.85:7078/appoint/massage_service.php", {
                            method: "POST",
                            body: JSON.stringify({
                                type: 'service',
                                date: a
                            })
                        })
                            .then(res => res.json())
                            .then(res => {
                                this.setState({
                                    docService: res
                                })
                            })
                    }
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    expandedRowRender = (e) => {
        //console.log(e)
        return (<div>
            <Card>
                <table>
                    <tr><td>เวลานัด</td><td>สถานะ</td></tr>
                    {e.childrens.map(a => (<tr>
                        <th>{a.time}</th>
                        <th><Button disabled={a.dis} onClick={() =>
                            this.selectTime([{ timeId: a.timeId, timeName: a.time, servicePointId: a.servicePointId, date: e.serviceDate, docId: e.docId, docName: e.docName }])}>{a.stat}</Button></th>
                    </tr>))}
                </table>
            </Card>
        </div>)
    }

    selectTime = (e) => {
        //console.log(e)
        this.setState({
            serviceModal: true,
            selectTime: e
        })
        fetch("http://183.88.219.85:7078/appoint/time_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                date: e.map(a => a.date).toString(),
                point: e.map(a => a.servicePointId).toString()
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    maxLength: res.length
                })
            })
    }

    selectService = (e) => {
        let serviceId = e.split("/")[0].toString(),
            serviceDesc = e.split("/")[1].toString(),
            selectService = [{ serviceId: serviceId, serviceDesc: serviceDesc }]
        this.setState({
            selectService: selectService
        })

    }
    selectServiceOk = () => {
        let dataService = [{
            serviceHn: this.props.person.map(a => a.hn).toString(),
            serviceDate: this.state.selectTime.map(a => a.date).toString(),
            serviceTimeId: this.state.selectTime.map(a => a.timeId).toString(),
            serviceTime: this.state.selectTime.map(a => a.timeName).toString(),
            servicePlans: this.props.person.map(a => a.plans).toString(),
            servicePointId: this.state.selectTime.map(a => a.servicePointId).toString(),
            servicePoint: "แพทย์แผนไทย",
            serviceNameId: this.state.selectService.map(a => a.serviceId).toString(),
            serviceName: this.state.selectService.map(a => a.serviceDesc).toString(),
            serviceDocId: this.state.selectTime.map(a => a.docId).toString(),
            serviceMaxLength: this.state.maxLength
        }]

        dataService.forEach(ser => {
            if (ser.serviceNameId === "") {
                message.warning("ระบุบริการ")
            } else {
                this.props.dispatch({
                    type: "ClearService"
                })
                this.props.dispatch({
                    type: "service",
                    dataService
                })
                this.setState({
                    serviceModal: false
                })
            }
        });

    }

    ButtonCheck = () => {
        let checkService = this.props.service.length,
            checkPerson = this.props.person.length
        if (checkService === 0 || checkPerson === 0) {
            message.warning("กรุณาทำรายการให้ครบถ้วน")
        }
        else {
            this.setState({
                Buttons: <Button block
                    style={{ borderRadius: "20px" }}
                    type={"primary"}
                    size={"large"}
                    onClick={this.Confirm}><Link to='/Confirm'> <Icon type="check-circle" style={{ fontSize: "23px" }} /> ยืนยัน</Link></Button>
            })
        }
    }

    selectServiceCancel = () => {
        this.setState({
            serviceModal: false
        })
    }

    render() {
        return (<div>
            <Logo />
            <br />
            <Steps progressDot current={1} >
                <Step title="ลงทะเบียน" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="idcard" />} />
                <Step title="ทำรายการนัดหมาย" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="solution" />} />
                <Step title="บันทึก" description={<Icon style={{ fontSize: "25px" }} type="file-done" />} />
            </Steps>
            <Card>
                <Col lg={{ span: 20, offset: 2 }}>
                    <Card style={{ borderRadius: "10px", borderColor: "#3399ff" }} >
                        <div style={{ textAlign: "center" }}>
                            <h2>ข้อมูลผู้ใช้</h2></div>
                        <table style={{ width: "100%", fontSize: "18px" }}>
                            <tr>
                                <td>ชื่อ-สกุล</td>
                                <td>{this.props.person.map(a => (<div>
                                    {a.prefix} {a.fname} {a.lname}
                                </div>))}</td>
                            </tr>
                            <tr>
                                <td>เลขบัตรประชาชน</td>
                                <td>{this.props.person.map(a => a.cid)}</td>
                            </tr>
                            <tr>
                                <td>วันเกิด</td>
                                <td>{this.props.person.map(a => a.birth)}</td>
                            </tr>
                            <tr>
                                <td>สิทธิ์</td>
                                <td>{this.props.person.map(a => a.plans)}</td>
                            </tr>
                        </table>
                    </Card>
                    <br />
                    <Card style={{ borderRadius: "10px", textAlign: "center", borderColor: "green" }}>
                        <div style={{ textAlign: "center" }}>
                            <h2>
                                แผนไทย
                            </h2>
                            <h2>เลือกวันที่นัด และ บริการ</h2>
                        </div>
                        <DatePicker
                            style={{ width: "100%" }}
                            onChange={this.changeDate}
                            size={"large"}
                            disabledDate={disabledDate}
                            value={moment(this.state.dateAppoint)}
                        />
                    </Card>
                    <br />
                    <Card style={{ borderRadius: "10px", textAlign: "center", borderColor: "green" }}>
                        <Table columns={this.state.column} dataSource={this.state.docService} expandedRowRender={this.expandedRowRender} pagination={false} />
                        <br />
                    </Card>
                    <br />
                    <Card tyle={{ borderRadius: "10px", borderColor: "#4d79ff" }}>
                        <h3>วันที่นัด: {this.state.dateAppoint} </h3>
                        <h3>จุดบริการ: {this.props.service.map(a => a.servicePoint)} </h3>
                        <h3>บริการ: {this.state.selectService.map(a => a.serviceDesc)}</h3>
                        <h3>เวลานัด: {this.props.service.map(a => a.serviceTime)}  </h3>
                        <h3>ผู้ให้บริการ: {this.state.selectTime.map(a => a.docName)}</h3>
                        <br />
                        {this.state.Buttons}
                    </Card>
                </Col>
                <br />
                <Button
                    style={{ borderRadius: "10px" }}
                    size="large"
                    type="" block ><Link to={`/?lineId=${this.props.person.map(a => a.line).toString()}`} ><Icon type="home" style={{ fontSize: "18px" }} /> กลับหน้าแรก</Link>
                </Button>
            </Card>
            <Modal
                title={"เลือกบริการ"}
                visible={this.state.serviceModal}
                okText={"ยืนยัน"}
                cancelText={"ยกเลิก"}
                onOk={this.selectServiceOk}
                onCancel={this.selectServiceCancel}
            >
                <div style={{ textAlign: "center" }}>
                    <Select
                        style={{ width: "200px" }}
                        onSelect={this.selectService}
                    >
                        {this.state.service.map(a => (
                            <Option value={a.service_name_id + "/" + a.service_name_order}>{a.service_name_order}</Option>
                        ))}
                    </Select>
                </div>
            </Modal>

        </div>)
    }
}
const data = state => {
    return {
        person: state.person,
        service: state.service
    }
}
export default connect(data)(Massage)