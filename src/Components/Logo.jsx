import React, { Component } from 'react'
import {  Row } from 'antd'

class Logo extends Component {
    render() {
        return <Row>
            <div style={{ textAlign: "center" }}>
                <br />
                <img src={"img/Logos.png"} width={"20%"} />
                <h1 style={{ color: "green" }}>โรงพยาบาลสามร้อยยอด</h1>
                <h2 style={{ color: "green" }}>กระทรวงสาธารณสุข</h2>
                <h2 style={{ color: "green" }}>ระบบนัดออนไลน์</h2>
                <h4 style={{ color: "red" }}>*ต้องเป็นผู้ป่วยที่เคยมารับบริการที่โรงพยาบาลสามร้อยยอดเท่านั้น</h4>
            </div>
        </Row>
    }
}

export default Logo