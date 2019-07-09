import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Card, Row, Col, DatePicker, Button, Select, notification, Modal, message, Icon, Steps } from 'antd'
import moment from 'moment'
import Logo from '../Components/Logo'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Option = Select.Option;
const Step = Steps.Step

const disabledDate = (cur) => {
    return cur < moment().add(+1, 'day') || cur > moment().add(+60, 'day')
}
class Appoint extends Component {
    constructor() {
        super();
        this.state = {
            checkBan: '0',
            massageLink: false,
            buttonSubStat: true,
            buttonSub: "dashed",
            modal: false,
            modalPopup: false,
            point: [],
            service: [],
            dateAppoint: [],
            timeWaiting: [],
            timeAppoint: "",
            timeAppointDesc: "",
            servicePoint: "",
            servicePointDesc: "",
            serviceId: "",
            serviceDesc: "เลือกบริการ",
            serviceTimeID: "",
            serviceTimeDesc: "",
            maxLength: "",
            Linkto: <Button block
                style={{ borderRadius: "20px" }}
                type={"default"}
                size={"large"}
                onClick={this.Confirm}>
                <Icon type="scan" style={{ fontSize: "23px" }} /> ตรวจสอบ
        </Button>
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        fetch("http://183.88.219.85:7078/appoint/point.php")
            .then(res => res.json())
            .then(res => {
                this.setState({
                    point: res
                })
            })

    }

    renderCheck = () => {
        let hn = this.props.person.map(a => a.hn).toString()
        // console.log(hn)
        fetch("http://183.88.219.85:7078/appoint/check_person_ban.php", {
            method: "POST",
            body: JSON.stringify({
                hn: hn
            })
        }).then(res1 => res1.json())
            .then(res1 => {
                let stat_b = res1.map(a => a.stat).toString()
                if (stat_b === "1") {
                    this.setState({
                        modalPopup: true
                    })
                }
            })
    }
    renderRedirect = () => {
        if (this.state.massageLink === true) {
            return <Redirect to='/massage' />
        }
    }
    changePoint = (e) => {
        console.log(e)
        if (e.split("/")[0].toString() === "2") {
            this.setState({
                massageLink: true
            })
        } else {
            this.setState({
                serviceDesc: "",
                serviceId: ""
            })
            this.setState({
                servicePoint: e.split("/")[0],
                servicePointDesc: e.split("/")[1]
            })
            fetch("http://183.88.219.85:7078/appoint/service.php", {
                method: "POST",
                body: JSON.stringify({
                    point: e.split("/")[0]
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        service: res
                    })
                })
        }
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
                    }
                })
        }
        catch (error) {
            console.log(error)
        }
    }

    changeService = (e) => {
        // console.log(e)
        this.setState({
            serviceId: e.split("/")[0],
            serviceDesc: e.split("/")[1]
        })

    }

    selectTime = () => {

        let dateApp = this.state.dateAppoint.toString(),
            servicePoint = this.state.servicePoint,
            serviceIds = this.state.serviceId
        const dateError = type => {
            notification[type]({
                duration: '10',
                message: "ระบุวันที่รับบริการอีกครั้ง",
                btn: <Button onClick={() => notification.destroy()}>close</Button>
            })
        }
        const pointError = type => {
            notification[type]({
                duration: '10',
                message: "ระบุจุดรับบริการ",
                btn: <Button onClick={() => notification.destroy()}>close</Button>
            })
        }
        const serviceError = type => {
            notification[type]({
                duration: '10',
                message: "ระบุบริการ",
                btn: <Button onClick={() => notification.destroy()}>close</Button>
            })
        }
        if (dateApp === "") {
            dateError('warning')
        }
        else if (servicePoint === "") {
            pointError('warning')
        }
        else if (serviceIds === "") {
            serviceError('warning')
        }
        else {
            fetch("http://183.88.219.85:7078/appoint/time_appoint.php", {
                method: "POST",
                body: JSON.stringify({
                    date: dateApp,
                    point: servicePoint
                })
            })
                .then(res => res.json())
                .then(res => {
                    // console.log(res.length)
                    this.setState({
                        timeWaiting: res,
                        modal: true,
                        buttonSub: "primary",
                        buttonSubStat: false,
                        maxLength: res.length
                    })
                })
        }
    }

    onClose = () => {
        this.setState({
            modal: false
        })
    }

    selectAppTime = (e) => {
        let id = e.split("-")[0],
            stat = e.split("-")[1].toString(),
            timeTh = e.split("-")[2].toString()
        //console.log(id + "=>" + stat + "=>" + timeTh)
        if (stat === "ว่าง") {
            message.success("เลือกรายการสำเร็จ")
            this.setState({
                serviceTimeID: id,
                serviceTimeDesc: timeTh,
                modal: false
            })
        }
        else {
            message.error("ไม่สามารถทำรายการจองได้")
        }
    }

    Confirm = () => {
        if (this.props.person.map(a => a.hn).toString() === "" ||
            this.state.dateAppoint === "" ||
            this.state.serviceTimeID === "" ||
            this.props.person.map(a => a.plans).toString() === "" ||
            this.state.servicePoint === "" ||
            this.state.serviceId === "") {
            message.error("กรุณาระบุข้อมูลให้ครบถ้วน")
        } else {
            let dataService = [{
                serviceHn: this.props.person.map(a => a.hn).toString(),
                serviceDate: this.state.dateAppoint,
                serviceTimeId: this.state.serviceTimeID,
                serviceTime: this.state.serviceTimeDesc,
                servicePlans: this.props.person.map(a => a.plans).toString(),
                servicePointId: this.state.servicePoint,
                servicePoint: this.state.servicePointDesc,
                serviceNameId: this.state.serviceId,
                serviceName: this.state.serviceDesc,
                serviceMaxLength: this.state.maxLength,
                serviceDocId: "0"
            }]
            //console.log(dataService)
            this.props.dispatch({
                type: "ClearService"
            })
            this.props.dispatch({
                type: "service",
                dataService
            })
            this.setState({
                Linkto: <Button block
                    style={{ borderRadius: "20px" }}
                    type={"primary"}
                    size={"large"}
                    onClick={this.Confirm}><Link to='/Confirm'> <Icon type="check-circle" style={{ fontSize: "23px" }} />ยืนยัน</Link></Button>
            })
        }
    }
    render() {
        return (

            <div>
                {this.renderCheck()}
                {this.renderRedirect()}
                <Logo />
                <br />
                <Steps progressDot current={1} >
                    <Step title="ลงทะเบียน" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="idcard" />} />
                    <Step title="ทำรายการนัดหมาย" description={<Icon style={{ fontSize: "25px", color: "#3399ff" }} type="solution" />} />
                    <Step title="บันทึก" description={<Icon style={{ fontSize: "25px" }} type="file-done" />} />
                </Steps>
                <Card>
                    <Col lg={{ span: 20, offset: 2 }}>

                        <Card style={{ borderRadius: "20px", borderColor: "#3399ff" }} >
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
                        <Card style={{ borderRadius: "20px", borderColor: "#00b300" }}>
                            <div style={{ textAlign: "center" }}>
                                <h2>เลือกจุดบริการ</h2>
                            </div>
                            <br />
                            <Select
                                size={"large"}
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="เลือกจุดที่รับบริการ"
                                optionFilterProp="children"
                                onChange={this.changePoint}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                defaultOpen={null}
                            >
                                {this.state.point.map(a => (
                                    <Option value={`${a.point_id}/${a.point_name}`}>{a.point_name}</Option>
                                ))}
                            </Select>
                        </Card>
                        <br />
                        <Card style={{ borderRadius: "20px", borderColor: "#00b300" }}>
                            <div style={{ textAlign: "center" }}>
                                <h2>ทันตกรรม</h2>
                                <h2>เลือกวันที่นัด และ บริการ</h2>
                            </div>
                            <br />
                            <DatePicker
                                style={{ width: "100%" }}
                                onChange={this.changeDate}
                                size={"large"}
                                disabledDate={disabledDate}
                                value={moment(this.state.dateAppoint)}
                            />
                            <br />
                            <br />
                            <Select
                                size={"large"}
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="เลือกบริการ"
                                optionFilterProp="children"
                                onChange={this.changeService}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                value={this.state.serviceDesc}
                            >
                                {this.state.service.map(a => (
                                    <Option value={`${a.service_name_id}/${a.service_name_order}`}>{a.service_name_order}</Option>
                                ))}
                            </Select>
                            <br />
                            <br />
                            <Button
                                style={{ borderRadius: "20px" }}
                                size={"large"}
                                block
                                onClick={this.selectTime}
                                type="primary" ><Icon style={{ fontSize: "25px" }} type="history" />เลือกเวลานัด
                            </Button>
                        </Card>
                        <Modal
                            visible={this.state.modal}
                            footer={null}
                            closable={""}
                        >
                            <Card style={{ borderRadius: "20px", textAlign: "center", border: " 2px solid green" }}>
                                <h2>เลือกเวลานัดจุดบริการ</h2>
                                <h2>{this.state.servicePointDesc}</h2>
                            </Card>
                            <br />
                            {this.state.timeWaiting.map(a => (
                                <div>
                                    <Row type="flex">
                                        <Card.Grid style={{ width: "50%", borderRadius: '20px 0px 0px 20px', textAlign: "center", backgroundColor: "#c2c2d6" }}>
                                            <h2>เวลานัด</h2>
                                            <h2>{`${a.time_point_name} น.`}</h2>
                                        </Card.Grid>
                                        <Card.Grid hoverable style={{
                                            width: "50%",
                                            borderRadius: '0px 20px 20px 0px', backgroundColor: `${a.color}`,
                                            textJustify: "inter-character",
                                            textAlign: "center"
                                        }}
                                            onClick={() => this.selectAppTime(`${a.time_point_id}-${a.desc_th}-${a.time_point_name}`)}>
                                            <br />
                                            <h2>{a.desc_th}</h2>
                                        </Card.Grid>
                                    </Row>
                                    <br />
                                </div>
                            ))}
                            <Button block
                                size={"large"}
                                type={"ghost"}
                                style={{ backgroundColor: "#ff3333", color: "#ffffff", borderRadius: "20px" }}
                                onClick={this.onClose}
                            >ปิด</Button>
                        </Modal>
                        <br />
                        <Card style={{ borderRadius: "20px", borderColor: "#4d79ff" }}>
                            <h3>วันที่นัด: {this.state.dateAppoint} </h3>
                            <h3>จุดบริการ: {this.state.servicePointDesc} </h3>
                            <h3>บริการ: {this.state.serviceDesc} </h3>
                            <h3>เวลานัด:{this.state.serviceTimeDesc} </h3>
                            <br />
                            {this.state.Linkto}
                        </Card>
                    </Col>
                    <br />
                    <Button
                        style={{ borderRadius: "20px" }}
                        size="large"
                        type="" block ><Link to={`/?lineId=${this.props.person.map(a => a.line).toString()}`} ><Icon type="home" style={{ fontSize: "18px" }} /> กลับหน้าแรก</Link>
                    </Button>
                </Card>
                <Modal
                    footer={false}
                    closable={false}
                    visible={this.state.modalPopup}
                >
                    <Card>
                        <p>คำเตือน</p>
                        <p>เนื่องจากระบบได้ตรวจพบการผิดนัดเกิน 3 ครั้ง</p>
                        <p>ระบบจะทำการล็อคการใช้งานระบบนัดออนไลน์ของคุณ</p>
                        <p>กรุณาติดต่อเจ้าหน้าที่เพื่อขอปลดล็อคการใช้ระบบนัดออนไลน์ได้ที่โรงพยาบาล</p>
                        <p>ในเวลาทำการเท่านั้น</p>
                    </Card>
                    <Button
                        size="large"
                        type="danger" block onClick={this.Back}><Link to={`/?lineId=${this.props.person.map(a => a.line).toString()}`} >ยืนยัน</Link>
                    </Button>
                </Modal>
            </div >
        )
    }
}

const Person = state => {
    return {
        person: state.person
    }
}
export default connect(Person)(Appoint)