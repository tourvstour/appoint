import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Regiter from './Components/Regiter'
import Appoint from './Components/Appoint'
import Confirm from './Components/Confirm'
import Monitor from './admin/Monitor'
import Massage from './Components/Massage'
import MassageAdmin from './Components/MassageAdmin'
import Dent from './Components/Dent'
import Login from './admin/Login'
const Rout = () => (
    <Router >
        <Route exact path="/" component={Regiter} />
        <Route path="/Appoint" component={Appoint} />
        <Route path="/Confirm" component={Confirm} />
        <Route path="/monitor" component={Monitor} />
        <Route path="/massage" component={Massage} />
        <Route path="/massageadmin" component={MassageAdmin} />
        <Route path="/login" component={Login} />
        <Route path="/dent" component={Dent} />
    </Router>
)

export default Rout