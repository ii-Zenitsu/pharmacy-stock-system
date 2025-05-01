import React, { useState } from "react";
import Auth from "../../assets/api/Auth";
import { Tabs } from 'antd';
import { ArrowLeft, ArrowRight, Check, Loader2} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { login, setLoading } from "../Redux/slices/AuthSlice"
import { addUser } from "../Redux/slices/UserSlice"
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/icon.png"

export default function SignTabs() {
    const [activeTab, setActiveTab] = useState("Login");
    const tabsContent = [
        // { label: "Sign Up", child: <SignupForm setActiveTab={setActiveTab} /> },
        { label: "Login", child: <LoginForm setActiveTab={setActiveTab} /> }
    ];
    return (
            <div className="w-full flex justify-center items-center rounded-none md:rounded-2xl p-4 md:p-8">
                <Tabs
                    activeKey={activeTab}
                    animated
                    centered
                    onTabClick={(key) => setActiveTab(key)}
                    items={tabsContent.map((t, i) => ({ label: t.label, key: t.label, children: t.child }))}
                />
            </div>
    );
}

export function SignupForm({ setActiveTab }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);
    const { users } = useSelector((state) => state.users);

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        birth_date: "",
        role: "employe",
    });

    const [errors, setErrors] = useState({});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        !cancel && dispatch(setLoading(true));
        const res = await Auth.Register(user, false);
        if (res.success) {
                dispatch(login({user: res.user, token: res.token }));
                navigate("/");
        }
        else {
            dispatch(setLoading(false));
            setErrors(res.errors)
        }
        
    };

    return (
        <div className="flex justify-center w-sm md:w-4xl gap-6 bg-base-200 border border-base-300 p-4 rounded-box">
            <fieldset className="fieldset w-full md:w-1/2">
                <h2 className="font-bold text-xl">Welcome to PharmaWise</h2>
                <p className="text-sm max-w-sm mt-2">
                    Create an account to manage your pharmacy operations
                </p>
                <form className="mt-2 flex flex-col gap-1.5" onSubmit={handleSubmit} >
                    <div className="flex flex-col md:flex-row gap-2">
                        <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                            <input className={`input w-full validator ${errors?.first_name ? "input-error!" : ""}`} placeholder="First name" type="text" onChange={e => setUser({ ...user, first_name: e.target.value.trim() })} value={user.first_name} required />
                            {errors?.first_name ? (<div className="text-error mb-1 text-xs">{errors?.first_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">First name is required</div>)}
                            <span className="text-xl" >First name</span>
                        </label>

                        <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                            <input className={`input w-full validator ${errors?.last_name ? "input-error!" : ""}`} placeholder="Last name" type="text" onChange={e => setUser({ ...user, last_name: e.target.value.trim() })} value={user.last_name} required />
                            {errors?.last_name ? (<div className="text-error mb-1 text-xs">{errors?.last_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">Last name is required</div>)}
                            <span className="text-xl" >Last name</span>
                        </label>
                    </div>

                    <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                        <input className={`input w-full validator ${errors?.email ? "input-error!" : ""}`} placeholder="Email" type="email" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                        {errors?.email ? (<div className="text-error mb-1 text-xs">{errors?.email[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid email address</div>)}
                        <span className="text-xl" >Email</span>
                    </label>

                    <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                        <input className={`input w-full validator ${errors?.birth_date ? "input-error!" : ""}`} type="date" onChange={e => setUser({ ...user, birth_date: e.target.value })} value={user.birth_date} required max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
                        {errors?.birth_date ? (<div className="text-error mb-1 text-xs">{errors?.birth_date[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid birthday date</div>)}
                        <span className="text-xl" >Birth date</span>
                    </label>


                    <div className="flex flex-col md:flex-row gap-2 mb-6">
                        <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200 relative">
                            <input className={`input w-full validator ${errors?.password ? "input-error!" : ""}`} placeholder="Password" type="password" onChange={e => setUser({ ...user, password: e.target.value })}  value={user.password} minLength={8} required />
                            <span className="text-xl" >Password</span>
                            {errors?.password ? (<div className="text-error mb-1 text-xs w-96 absolute not-md:top-22">{errors?.password[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible w-96 absolute">Password must be at least 8 characters</div>)}
                        </label>

                        <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                            <input className={`input w-full validator ${errors?.password ? "input-error!" : ""}`} placeholder="Confirm Password" type="password" onChange={e => setUser({ ...user, password_confirmation: e.target.value})} value={user.password_confirmation} minLength={8} required />
                            <span className="text-xl" >Confirm Password</span>
                        </label>
                    </div>

                    <button className="btn btn-primary w-full" type="submit" > Sign Up {isLoading ? <Loader2 className="mt-1 animate-spin" /> : <Check className="mt-1"/>}</button>
                </form>
                <div className="divider">Already have an account?</div>
                <button className="btn btn-secondary btn-soft w-full" onClick={() => setActiveTab("Login")}>Login</button>
            </fieldset>
            <SideLogo />
        </div>
    );
}


export function LoginForm({ setActiveTab = null }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        dispatch(setLoading(true));
        const res = await Auth.Login(user);
        if (res.success) {
            dispatch(login({user: res.user, token: res.token }));
            navigate("/");
        }
        else {
            dispatch(setLoading(false));
            setErrors(res.errors)
        }
    };

    return (
        <div className="flex justify-center w-sm md:w-4xl gap-6 bg-base-200 border border-base-300 p-4 rounded-box">
            <fieldset className="fieldset w-full md:w-1/2">
                <h2 className="font-bold text-xl">Welcome to PharmaWise</h2>
                <p className="text-sm max-w-sm mt-2">
                    Log in to track orders and pharmacy tasks
                </p>
                <form className="flex flex-col mt-2 gap-1.5 md:mb-34" onSubmit={handleSubmit}>
                    <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                        <input className={`input w-full validator ${errors?.email || errors?.password ? "input-error!" : ""}`} placeholder="Email" type="email" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                        {errors?.email ? (<div className="text-error mb-1 text-xs">{errors?.email[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid email address</div>)}
                        <span className="text-xl" >Email</span>
                    </label>

                    <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                        <input className={`input w-full validator ${errors?.password ? "input-error!" : ""}`} placeholder="Password" type="password" onChange={e => setUser({ ...user, password: e.target.value })}  value={user.password} minLength={8} required />
                        <span className="text-xl" >Password</span>
                        {errors?.password ? (<div className="text-error mb-1 text-xs">{errors?.password[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Password must be at least 8 characters</div>)}
                    </label>

                    <button className="btn btn-primary w-full" type="submit"> Login {isLoading ? <Loader2 className="mt-1 animate-spin" /> : <ArrowRight className="mt-1"/>}</button>
                </form>
                <div className="divider">You don't have an account yet?</div>
                <button className="btn btn-secondary btn-soft" onClick={() => setActiveTab("Sign Up")}>Sign Up</button>
            </fieldset>
            <SideLogo />
        </div>
    );
}

export function SideLogo() {
    return (
        <div className="hidden md:flex flex-col rounded-3xl w-1/2 p-2 justify-center items-center my-4">
            <img src={logo} className="w-xs" alt="logo" />
            <div className="text-6xl font-semibold">
                <span className="text-primary">Pharma</span>
                <span className="text-[#1e6f61]">WISE</span>
            </div>
            <span className="text-neutral text-center mt-3 text-xl capitalize">organize, track and simplify your pharmacy management</span>
        </div>
    )
}