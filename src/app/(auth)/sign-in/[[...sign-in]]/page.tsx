import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
 
export default function Page() {
  return (
    <div style={{
      backgroundImage: "url('https://placehold.co/1920x1080')",
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
        <SignIn />
      </motion.div>
    </div>
  );
}