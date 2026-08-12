import React from "react";
import { motion }  from "motion/react";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from '../components/LoginModel'
import {useState} from "react";
import dashboard from "../assets/das.png";
import { FiMic,FiFileText, FiBarChart2, FiMap } from "react-icons/fi";
function Home ({setUser}){
    const [showLogin,setShowLogin] = useState(false);

    return (
        <div className='bg-white text-[#0A0A0A] font-sans min-h-screen overflow-x-hidden'>
            {/*nav bar*/}

            <motion.nav 
            initial={{y:-60,opacity:0 }}
            animate={{y:0,opacity:1}}
            transition={{duration:0.5,ease:"easeOut"}}
            className = 'fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-5 bg-white backdrop-blur-xl border-b border-black/5'>
            
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A0A0A] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
                    <GiArtificialHive size={15} color="white"/></div>
                <span className="font-extrabold text-base tracking-tight text-[#0A0A0A]">FreshAI</span>
                </div>
                <motion.button
                onClick={()=>setShowLogin(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 2.1 }}
                className="bg-[#0A0A0A]/80 backdrop-blur-2xl text-white 
                 font-semibold border border-white/10 rounded-md px-3 py-1.5 text-xs
                  cursor-pointer transition-all hover:border-white/20 
                  shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center gap-2">
                    Login In <FaArrowRight />
                </motion.button>

            </motion.nav>
            {/* Main Content */}
            <section className="relative pt-20 pb-14 overflow-hidden bg-[#e2ebf3]">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[600px] h-[600px] rounded-full bg-black/4 blur-[90px] 
                pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center">
                   <motion.div 
                   initial={{y:16,opacity:0}}
                   animate={{y:0,opacity:1}}
                   transition={{duration:0.5,delay:0.05}}
                   className=" inline-flex items-center px-3 py-0.5
                   rounded-full border border-black/15 bg-black/5 text-black/70
                   text-xs font-medium mb-4">
                      Multi-Agent AI Interview Platform
                    </motion.div>
                    <motion.h1 
                       initial={{y:20,opacity:0}}
                       animate={{y:0,opacity:1}}
                       transition={{duration:0.55,delay:0.12}}
                    className="text-3xl md:text-5xl font-extrabold leading-[1.1]
                    tracking-tight mb-4 text-[#0A0A0A] [text-shadow:0_4px_24px_rgba(0,0,0,0.12)]" >
                        Job Interview Preparation with AI Agents <br />
                        <span className="text-black/30">
                        Prepare smarter, not harder.
                        </span> <br />
                        Anymore!
                    </motion.h1>
                    <motion.p 
                       initial={{y:20,opacity:0}}
                       animate={{y:0,opacity:1}}
                       transition={{duration:0.55,delay:0.2}}
                    className="text-black/45 text-sm leading-relaxed max-w-md mx-auto mb-6
                    [text-shadow:0_2px_10px_rgba(0,0,0,0.06)]">
                        FreshAI is a cutting-edge platform that leverages the power of AI
                        to help you prepare for job interviews.
                        Our multi-agent system simulates real interview scenarios, 
                        providing you with personalized feedback and guidance to 
                        improve your performance.    
                    </motion.p>
                    <motion.div
                        initial={{y:20,opacity:0}}
                        animate={{y:0,opacity:1}}
                        transition={{duration:0.55,delay:0.28}}
                        className="">
                        <motion.button 
                         onClick={()=>setShowLogin(true)}
                         whileHover={{ scale: 1.04, boxShadow:"0 0 32px rgba(0,0,0,0.18)" }}
                         whileTap={{ scale: .97 }}
                        className="relative  gap-2 overflow-hidden bg-[#0A0A0A]/80 backdrop-blur-2xl
                        text-white font-bold px-5 py-2.5 rounded-lg text-xs cursor-pointer 
                        border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                        transition-all hover:border-white/20 "> 
                            <span className="flex items-center justify-center
                            gap-2"> Get Started for Free <FaArrowRight />
                            </span>
                            <span className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent
                            to-transparent pointer-events-none rounded-lg"/>
                        </motion.button>    
                    </motion.div>
                </div>
                <motion.div 
                    initial={{y:30,opacity:0}}
                    animate={{y:0,opacity:1}}
                    transition={{duration:0.7,delay:0.3}}
                    whileHover={{y:-10, scale:1.02}}
                    className="mt-10 rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.06)]
                max-w-2xl mx-auto">
                    <img src={dashboard} alt="dashboard image" className="w-full h-auto" />
                </motion.div>
            </section>

            {/* Agents */}
            <section className="py-16 bg-[#F8F9FA]">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full 
                        border border-black/15 bg-black/5 text-black/70 text-xs font-medium mb-4 ">
                            AI Powered Agents
                        </div>
                        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0A0A0A]
                                       [text-shadow:0_4px_20px_rgba(0,0,0,0.1)]">
                                        Specilized Agents For 
                                        <span className="block text-black/30">
                                            Every Interview Scenario
                                        </span>

                        </h2>
                        <p className="text-black/50 text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
                            Fresher.AI combine multiple AI Agents that work together  to help you buid your Resume,
                            Practice interviews, Receive detailed Feedback and Follow a Personalized Roadmap to
                            land you your dream job. 

                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {
                            [
                                {
                                  icon:<FiFileText />,
                                  title:"Resume Builder",
                                  desc:"Create ATS friendly resumes, improve profile strength and maximize interview opportunities.",
                                },
                                {
                                    icon:<FiMic />,
                                    title:"Interviews Agent",
                                    desc:"Conduct Realistic HR, Technical and Coding interviews with AI Powered Simulation.",
                                },
                                {
                                    icon:<FiBarChart2 />,
                                    title:"Feedback Agent",
                                    desc:"Get Detailed answer analysis, Scoring Reports and Recommendations to improve your performance.",
                                },
                                {
                                    icon:<FiMap />,
                                    title:"RoadMap Agent",
                                    desc:"Generate Peronalised learning roadmaps based on goals,skills and Performance.",
                                }
                            ].map((agent,index) =>(
                                <motion.div 
                                    
                                    key={index} 
                                    initial={{y:24,opacity:0}}
                                    whileInView={{opacity: 1,y: 0}}
                                    viewport={{once:true}}
                                    transition={{duration: 0.45,delay: index*0.08}}
                                    whileHover={{y:-10, scale:1.02}}
                                    className="group relative overflow-hidden bg-[#0A0A0A]/80
                                    backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] 
                                    transition-all hover:border-white/20 ">
                                    
                                    <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent
                                                    to-transparent pointer-events-none" />
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10
                                                    rounded-full blur-3xl opacity-0 group-hover: opacity-100 transition-opacity
                                                    duration-500" />
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md
                                                        border border-white/15 flex items-center justify-center text-white
                                                        text-lg mb-4 shadow-inner">{agent.icon}</div>


                                        <h2 className="text-base font-bold mb-2 text-white">{agent.title}</h2>
                                        <p className="text-white/45 text-xs leading-relaxed">{agent.desc}</p>
                                    </div>
                                    
                                </motion.div>
                            ))
                        }
                    </div>
                </div>
            </section>
            {showLogin && <LoginModel onClose={() => setShowLogin(false)} setUser={setUser}/>}
            <footer className="border-t border-black/7 py-6 text-center bg-white">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-md bg-[#0A0A0A] flex items-center justify-center">
                        <GiArtificialHive size={11} color="white"/>
                    </div>
                    <span className="font-bold text-xs text-[#0A0A0A]/70">Fresher AI</span>
                </div>
                <div className="text-black/60 text-xs">
                    ©{new Date().getFullYear()} Fresher.AI . All rights reserved.
                </div>
            </footer>
        </div>
    )
}
export default Home