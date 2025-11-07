'use client';

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/appnity/image/upload/v1730812345/tasknity-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Semi-transparent overlay to enhance text contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          zIndex: 0,
        }}
      />

      {/* Floating SignIn Box */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          zIndex: 1,
          backdropFilter: "blur(15px)",
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          padding: "2rem 3rem",
        }}
      >
        <SignIn
          appearance={{
            elements: {
              card: "shadow-none bg-transparent",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-500 text-white font-medium",
              socialButtonsBlockButton:
                "bg-blue-700 hover:bg-blue-600 text-white",
              footerActionLink: "text-blue-300 hover:text-blue-100",
              headerTitle: "text-white text-lg font-semibold",
              headerSubtitle: "text-gray-200",
            },
          }}
        />
      </motion.div>
    </motion.div>
  );
}
