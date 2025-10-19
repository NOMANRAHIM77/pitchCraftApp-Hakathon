
import Home from '../pages/Home'
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link component
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {LoginSchemas} from '../schemas/LoginSchemas'
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"


// firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login (){
    const navigate = useNavigate();

const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchemas),
  });


  async function submit(data) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      alert(error.message);
      console.error("Login error:", error);
    }
  }

return(
    <>
    <form onSubmit={handleSubmit(submit)}>
<div   className="w-screen h-screen  bg-[#F2F4F7] flex justify-center items-center "  >
    <div  className="w-250 h-100  flex justify-between items-center  " >
    <div  className="w-140 "  >
        <h1 className="text-6xl mb-2 text-red-700 font-bold "  >PITCH CRAFT</h1>
        <h2 className="text-3xl" >Generate creative startup names & taglines </h2>
    </div>
    <div className="w-100 h-95 bg-[#FFFFFF] shadow-grey  shadow-lg  flex flex-col justify-center rounded-md gap-5" >
<div  className="flex flex-col  w-full justify-center items-center gap-5 " >

<input  
{...register("email")}
type="text"  placeholder="Email or Phone number"  className=" w-[90%] border border-gray-400 px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 " />
<div  className="h-1 w-full" >{errors.email && <p className="h-full w-full flex justify-items-start items-center px-5 text-red-500 " >{errors.email.message}</p>}</div>
<input 
{...register("password")}
type="password" placeholder="Password"  className="  w-[90%] border border-gray-400 px-2 py-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-200 "  />
<div  className="h-1 w-full" >{errors.password && <p className="h-full w-full flex justify-items-start items-center px-5 text-red-500 " >{errors.password.message}</p>}</div>

<button type="submit" className="w-[90%] h-13 bg-[#f21818] hover:bg-red-800 text-white  text-[19px] font-semibold rounded-md cursor-pointer " >Log in</button>
<hr className="w-3/4 mx-auto border-t border-gray-300"  />
<Link  to="/signup" className=" flex justify-center items-center w-[70%] h-13 bg-[#68dd50] hover:bg-green-700  text-white  text-[17px] font-semibold rounded-md cursor-pointer " >Create New Account</Link>
</div>

    </div>
</div>
</div>
</form>
    </>
)

}

export default Login