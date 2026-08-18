import { easeIn } from "motion/react";
import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiUpload, FiUploadCloud,FiUser } from "react-icons/fi";
import api from "../utils/axios";
import { useSelector, useDispatch } from "react-redux";
import { setResume } from "../redux/resumeSlice";
import {PolarAngleAxis, RadialBar, RadialBarChart} from "recharts";

// Components hai ye and iske under callback function hai
const ScoreRing = ({score})=>{
  const color = score>=75 ? "#7c3aed" : score>=50 ? "#f59e0b": "#ef4444";
  return (
    <div className="relative flex items-center justify-center">
       <RadialBarChart 
       width={110}
       height={110}
       cx={55}
       cy={55}
       innerRadius={40}
       outerRadius={53}
       startAngle={90}
       endAngle={-270}
       data={[{value:score,fill:color}]}
       barSize={8}>
        <PolarAngleAxis type="number" domain={[0,100]} tick={false}/>
        <RadialBar background={{ fill:"#e5e7eb"}} dataKey="value" cornerRadius={8}/>
       </RadialBarChart>
       <div className="absolute flex items-center">
        <span className="text-lg font-bold text-white leading-none">{score}</span>
        <span className="text-[9px] text-gray-200 mt-0.5">/100</span>
       </div>
    </div>
  )
}

const Tag = ({text,color})=>{
  const styles = {
    purple:"bg-purple-50 text-purple-700 border-purple-200",
    red:   "bg-red-50 text-red-700 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow:"bg-yellow-50 text-yellow-700 border-yellow-200"
  }  
  return (
       <div className={`text-[10px] px-1.5 py-1 rounded-md border font-medium ${styles[color]}`}>
         {text}
       </div>
    )
}
const Navbar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-20 border-b border-black/8
        bg-white/8 backdrop-blur-xl"
    >
      <div
        className="mx-auto flex h-12 max-w-7xl items-center 
           justify-start px-3 sm:px-5"
      >
        <div
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <span className="text-sm font-extrabold sm:text-base text-[#0a0a0a] ">
            FresherAI
          </span>
          <span
            className="hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px]
                 text-black/50 sm:block"
          >
            {label}
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

function Scorer({ user, setUser }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { resume } = useSelector((state) => state.resume);
  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/api/resume/upload", formData);
      dispatch(setResume(response?.data?.data));
      console.log(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Upload failed");
      setLoading(false);
    }
  };
  // Scorer Section
  if (resume)
    return (
      <div className="min-h-screen bg-white text-[#0a0a0a]">
        <Navbar label="Resume Scorer" />
        <section className="max-w-6xl mx-auto px-3 pt-18 sm:pt-20 pb-8 space-y-3.5">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] text-black/40 tracking-widest uppercase mb-0.5">
                Resume Analysis
              </p>
              <h2 className="text-lg font-bold">{resume?.name}</h2>
            </div>
            <button
              onClick={() => dispatch(setResume(null))}
              className="text-[10px] sm:text-xs text-black/50 hover:text-[#0a0a0a]
          border border-black/15 hover:border-black/35 px-2.5 py-1 rounded-lg transition-colors"
            >
              Re-Uploaded
            </button>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl 
        border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 sm:flex-row
        shadow-[0_8px_32px__rgba(0,0,0,0.2)]"
          >
            <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent 
          to-transparent pointer-events-none"/>
            <div className="relative">
              <ScoreRing score={resume.score}/>
            </div>
            <div className="relative">
              <p className="text-white/50 text-xs mb-0.5">Resume Score</p>
              <p className="text-lg sm:text-xl font-bold mb-1.5 text-white">
                {resume.score >=75 ? "Strong":resume.score >=50 ? "Average":"Needs Work"}
              </p>
              <div className="flex items-center gap-1">
                <FiUser className="text-purple-400 text-xs"/>
                <span className="text-xs text-purple-300">
                  {resume?.suggestedRole}
                </span>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl 
              border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 sm:flex-row
              shadow-[0_8px_32px__rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent 
                   to-transparent pointer-events-none"/>
                   <div className=""></div>
                   <div></div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl 
                       border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4 sm:flex-row
                       shadow-[0_8px_32px__rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent 
            to-transparent pointer-events-none"/>

            </motion.div>
          </div>
        </section>
      </div>
    );
  // upload section
  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      <Navbar label="Resume Scorer" />

      <section
        className="flex min-h-screen items-center justify-center px-3
                pt-18 pb-6"
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden
            bg-[#000000]/90 backdrop-blur-2xl border border-white/10 p-4 
            shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-6"
        >
          <div
            className="absolute inset-0 bg-linear-to-br from-white/8
            via-transparent to-transparent pointer-events-none"
          />
          <p
            className="relative text-[10px] text-white/10 tracking-widest
           uppercase mb-1.5"
          >
            Step 1 to 2{" "}
          </p>
          <div className="relative w-full h-1 bg-white/10 rounded-full mb-4">
            <div className="h-1 bg-white rounded-full w-1/2" />
          </div>

          <h2 className="relative text-lg font-bold mb-1 text-white">
            Upload Your Resume
          </h2>

          <p className="relative text-white/45 text-xs mb-4">
            w'll score it and give you actionable feedback
          </p>

          <label
            className={`relative flex flex-col items-center 
          justify-center w-full h-40 sm:h-48 rounded-2xl border-2   
          border-dashed cursor-pointer transition-colors 
          ${
            file
              ? "border-white/40 bg-white/6"
              : "border-white/15 bg-white/3 hover:border-white/30"
          }`}
          >
            <FiUploadCloud
              className={`text-4xl sm:text-5xl mb-2.5
                ${file ? "text-green-500" : "text-white/30"}`}
            />

            <p className="text-xs font-medium text-white/80 ">
              {file ? file.name : "Click or drag PDF here"}
            </p>
            <p className="text-[10px] text-white/35 mt-1">PDF Only Max 20mb</p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            disabled={!file || loading}
            onClick={uploadResume}
            className="relative mt-4 w-full h-10 rounded-xl font-semibold text-xs bg-white
           text-[#0a0a0a] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90
           disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Analyzing" : "Analyze Resume"}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}

export default Scorer;
