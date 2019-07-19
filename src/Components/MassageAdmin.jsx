import React, { Component } from 'react'
import { Card, Modal, Select, Input, message, DatePicker, Button, Popconfirm, Icon } from 'antd'
import '../Style/Tables.css'
import moment from 'moment'
import { withCookies } from 'react-cookie';

const { Option } = Select
const { Search } = Input
var date = new Date()
date = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
class MassageAdmin extends Component {

    constructor() {
        super()
        this.state = {
            selectDate: "",
            selectService: "",
            person: [],
            massageService: [],
            timeSelect: [],
            massageData: [],
            modalAdd: false,
            modalEdit: false,
            userLogin: "",
            phone: ""
        }
    }

    componentDidMount() {
        const { cookies } = this.props
        let user = cookies.get('provider')
        //let date = new Date()
        //date = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`
        console.log(user)
        this.setState({
            selectDate: date,
            userLogin: user
        })
        fetch("http://183.88.219.85:7078/appoint/service.php", {
            method: "POST",
            body: JSON.stringify({
                point: 2
            })
        }).then(res => res.json())
            .then(res => {
                this.setState({
                    massageService: res
                })
            })
        fetch("http://183.88.219.85:7078/appoint/massage_table.php", {
            method: "POST",
            body: JSON.stringify({
                date: date
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    massageData: res
                })
            })
    }

    selectDate = (a, b) => {
        if (b === "") {

        } else {
            fetch("http://183.88.219.85:7078/appoint/massage_table.php", {
                method: "POST",
                body: JSON.stringify({
                    date: b
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        massageData: res,
                        selectDate: b
                    })
                })
        }
    }

    seletTime = (e) => {
        console.log(e)
        let type = e.map(a => a.stat).toString(),
            serviceId = e.map(a => a.serviceId).toString()
        this.setState({
            timeSelect: e
        })
        // console.log(type)

        switch (type) {
            case "true":
                this.setState({
                    modalEdit: true
                })

                break;
            case "false":
                this.setState({
                    modalAdd: true
                })
                break;
            default:
                break;
        }
    }

    searchHn = (e) => {
        let hn = e
        fetch("http://183.88.219.85:7078/appoint/person_hn.php", {
            method: "POST",
            body: JSON.stringify({
                hn: hn
            })
        }).then(res => res.json())
            .then(res => {
                this.setState({
                    person: res,
                    phone: res.map(a => (a.phone)).toString()
                })
            })
    }

    selectService = (e) => {
        this.setState({
            selectService: e
        })
    }

    waitingAppoint = () => {
        let person = this.state.person,
            service = [{
                hn: this.state.person.map(a => a.patient_hn).toString(),
                serviceDate: this.state.timeSelect.map(a => a.date).toString(),
                serviceTime: this.state.timeSelect.map(a => a.timeId).toString(),
                servicePlans: this.state.person.map(a => a.contract_plans_description).toString(),
                servicePoint: this.state.timeSelect.map(a => a.pointId).toString(),
                serviceName: this.state.selectService.toString(),
                docId: this.state.timeSelect.map(a => a.docId).toString(),
                phone: this.state.phone.toString()
            }]

        service.forEach(service => {
            if (service.hn === "" || service.serviceDate === "" || service.serviceTime === "" || service.servicePlans === "" || service.servicePoint === "" || service.serviceName === "" || service.docId === "" || person === [] || service.phone === "") {
                message.error("กรุณาทำรายการให้ครบถ้วน")
            } else {
                fetch("http://183.88.219.85:7078/appoint/appointing_massage.php", {
                    method: "POST",
                    body: JSON.stringify({
                        person: person,
                        service: service
                    })
                }).then(res => res.json())
                    .then(res => {
                        //console.log(res)
                        let mess = res.map(a => a.message).toString(),
                            stat = res.map(a => a.stat).toString()
                        if (stat === "0") {
                            message.warning(mess)
                        } else {
                            message.success(mess)
                            fetch("http://183.88.219.85:7078/appoint/massage_table.php", {
                                method: "POST",
                                body: JSON.stringify({
                                    date: date
                                })
                            })
                                .then(res => res.json())
                                .then(res => {
                                    this.setState({
                                        massageData: res,
                                        modalAdd: false
                                    })
                                })
                        }
                    })
            }
        });
    }

    confirmDelete = (e) => {
        console.log(e)
        let userLoggin = this.state.userLogin,
            id = e.toString()
        fetch("http://183.88.219.85:7078/appoint/cancel_appoint.php", {
            method: "POST",
            body: JSON.stringify({
                id: id,
                user: userLoggin
            })
        }).then(() => {
            fetch("http://183.88.219.85:7078/appoint/massage_table.php", {
                method: "POST",
                body: JSON.stringify({
                    date: date
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        massageData: res,
                        modalEdit: false
                    })
                })
        })
    }

    PhoneNumber = (e) => {
        let number = e.target.value
        this.setState({
            phone: number
        })
    }

    render() {
        return (
            <div >
                <Card style={{ width: "100%", overflowX: "auto" }}>
                    <h1 style={{ textAlign: "center" }}>จุดบริการแพทย์แผนไทย</h1>
                    <div style={{ textAlign: "center" }}>
                        <h3 >  วันที่ :{" "}
                            <DatePicker
                                value={moment(this.state.selectDate)}
                                onChange={this.selectDate}
                            />
                        </h3>
                    </div>
                    <br />
                    <table className="Table-Main">
                        {this.state.massageData.map(a => (
                            <tr className="Table-tr">
                                <td className={"Table-Name"} >
                                    {a.doctor_name_prefex} {a.doctor_name_fname} {a.doctor_name_lname}
                                </td>
                                {a.service.map(b => (
                                    <td className="Table-collapse Table-Time Table-td"
                                        onClick={() => this.seletTime([{
                                            docId: a.doctor_name_id, pointId: a.point_id, timeId: b.timeId, stat: b.dis, serviceId: b.serviceId, docName: a.doctor_name_prefex + ' ' + a.doctor_name_fname + ' ' + a.doctor_name_lname, timeName: b.time, date: b.serviceDate, serviceName: b.serviceName, userName: b.name, phone: b.phone
                                        }])}
                                    >
                                        <p>เวลา {b.time} น.</p>
                                        <p>{b.name}</p>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </Card>
                {/*Modal Add*/}
                <Modal
                    title={"ทำรายการนัด"}
                    name={"Add"}
                    visible={this.state.modalAdd}
                    onCancel={() => this.setState({ modalAdd: false })}
                    onOk={this.waitingAppoint}
                >
                    {this.state.timeSelect.map(a => (
                        <div>
                            <Card style={{ borderRadius: "10px" }}>
                                <h3>ผู้ให้บริการ {a.docName}</h3>
                                <h3>วันที่ {a.date}</h3>
                                <h3>เวลา {a.timeName}</h3>
                            </Card>
                            <br />
                            <Card style={{ borderRadius: "10px" }}>
                                <p>ค้นหาผู้ป่วย</p>
                                <Card style={{ borderRadius: "10px" }}>
                                    <Search id={"hn"} placeholder={"ค้นหาผู้ป่วยจากHN"} enterButton={"ค้นหา"} onSearch={this.searchHn} />
                                    {this.state.person.map(b => (
                                        <div>
                                            <h3>HN: {b.patient_hn}</h3>
                                            <h3>ผู้รับบริการ {b.patient_prefix_description} {b.patient_firstname} {b.patient_lastname}</h3>
                                            <h3>อายุ {b.age}</h3>
                                            <h3>สิทธิ์ {b.contract_plans_description}</h3>
                                        </div>
                                    ))}
                                </Card>
                                <br />
                                <Select style={{ width: "100%" }}
                                    placeholder={"ระบุบริการ"}
                                    onSelect={this.selectService}
                                >
                                    {this.state.massageService.map(a => (
                                        <Option value={a.service_name_id}>{a.service_name_order}</Option>
                                    ))}
                                </Select>
                                <br />
                                <br />
                                <Input placeholder="เบอร์ติดต่อ" id="phone" value={this.state.phone} onChange={this.PhoneNumber} />
                            </Card>
                        </div>
                    ))}
                </Modal>
                {/*Modal Add*/}

                {/*Modal Edit*/}
                <Modal
                    title={"แก้ไข"}
                    name={"Edit"}
                    visible={this.state.modalEdit}
                    onCancel={() => this.setState({ modalEdit: false, timeSelect: [] })}
                    onOk={() => this.setState({ modalEdit: false, timeSelect: [] })}
                >
                    {this.state.timeSelect.map(a => (
                        <div>
                            <Card style={{ borderRadius: "10px" }}>
                                <h3>ผู้รับบริการ: {a.userName}</h3>
                                <h3>ผู้ให้บริการ: {a.docName}</h3>
                                <h3>วันที่-เวลา: {a.date}/{a.timeName + " น."}</h3>
                                <h3>บริการ: {a.serviceName}</h3>
                                <h3>เบอร์ติดต่อ: {a.phone}</h3>
                                <br />
                                <Popconfirm title={"ยืนยันการยกเลิกบริการนี้"}
                                    onConfirm={() => this.confirmDelete(this.state.timeSelect.map(a => a.serviceId).toString())}
                                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                    okType={"danger"}
                                    okText={"ยืนยัน"}
                                    cancelText={"ปิด"}
                                >
                                    <Button block type={"danger"}>ยกเลิกบริการ</Button>
                                </Popconfirm>
                            </Card>
                        </div>
                    ))}
                </Modal>
                {/*Modal Edit*/}
            </div >
        )
    }
}
export default withCookies(MassageAdmin)