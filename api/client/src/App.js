import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import AllEmployee from './Pages/AllEmployee';
import Shifts from './Pages/Shifts';
import Attendence from './Pages/Attendence';
import Leaves from "./Pages/Leaves";
import Holiday from './Pages/Holiday';
import Teams from './Pages/Teams';
import Designations from './Pages/Designations';
import SingleEmployee from './Pages/SingleEmployee';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import PageNotFound from "./Pages/PageNotFound";
import AppLayout from "./Layouts/AppLayout";
import { AuthContext } from "./context/AuthContext";

const App = () => {

    const { user } = useContext(AuthContext);

    // Routes
    const paths = {
        "": (user?._doc.designation.name.toUpperCase() === "ADMINISTRATOR" ? <Dashboard /> : <EmployeeDashboard />),
        "employees": <AllEmployee />,
        "employee": <SingleEmployee />,
        "shifts": <Shifts />,
        "attendence": <Attendence />,
        "leaves": <Leaves />,
        "holidays": <Holiday />,
        "teams": <Teams />,
        "designations": <Designations />,
        "profile": <Profile />,
        "settings": <Settings />,
    };

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/accounts/login" element={<Login />} />
                    {
                        user?.authorizedPages.map((page) => (
                            <Route path={page} key={page} element={
                                <AppLayout>
                                    {paths[page.split("/")[1]]}
                                </AppLayout>
                            } />
                        ))
                    }
                    <Route path="*" element={
                        <AppLayout>
                            <PageNotFound />
                        </AppLayout>
                    } />
                </Routes>
            </Router>
        </>
    )
}

export default App;
