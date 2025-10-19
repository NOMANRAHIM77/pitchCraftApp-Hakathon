import Login from "./Authentication/Login"
import Signup from "./Authentication/Signup";
import SampleForm from './SampleForm'
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Routes from "./routes/Routes";
import Provider from "./layout/Provider";

import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";




function App (){

const router = createBrowserRouter([
 
    {
    path:'/',
    element:(
      <>
    <Login/>
 
      </>
    )
  },
  {
    path:'/Login',
    element:(
      <>
    <Login/>
    {/* <SampleForm/> */}
      </>
    )
  },
    {
    path:'/signup',
    element:(
      <>
     <Signup/>
      </>
    )
  },

  ...Routes.map((currRoute) => ({
      path: currRoute.Route,
      element: (
        <PrivateRoute>  
            <Layout>{currRoute.component}</Layout>
        </PrivateRoute>
      ),
    })),
   
])



return(
    <>
    <Provider>
<RouterProvider router={router} />
    </Provider>
    </>
)

}

export default App