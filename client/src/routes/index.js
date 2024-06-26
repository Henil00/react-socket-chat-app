import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Register from "../pages/Register"
import Checkemail from "../pages/Checkemail"
import Checkpassword from "../pages/Checkpassword"
import Home from "../pages/Home"
import MessagePage from "../components/MessagePage"
import AuthLayouts from "../layout"
import Forgotpassword from "../pages/Forgotpassword"

const router = createBrowserRouter([
    {
        path: "/",
        element : <App/>,
        children: [
            {
                path: "register",
                element: <AuthLayouts><Register/></AuthLayouts> 
            },
            {
                path: "email",
                element: <AuthLayouts><Checkemail/></AuthLayouts> 
            },
            {
                path: "password",
                element: <AuthLayouts><Checkpassword/></AuthLayouts>    
            },
            {
                path: "forgotpassword",
                element: <AuthLayouts><Forgotpassword/></AuthLayouts>
            },
            {
                path: "/",
                element: <Home/>,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router