
'use client';

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
 
export default function Page() {
  return (
    <div style={{
      backgroundImage: "url('https://res.cloudinary.com/dcamqqj3j/image/upload/v1762322564/Login_tasknity.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: '5rem',
    }}>
      <motion.div whileTap={{ scale: 0.95 }}>
        <SignIn appearance={{
          elements: {
            card: "shadow-none bg-transparent",
            socialButtonsBlockButton: "bg-slate-800 hover:bg-slate-700",
            footerActionLink: "text-white hover:text-gray-200"
          }
        }} />
      </motion.div>
    </div>
  );
}
