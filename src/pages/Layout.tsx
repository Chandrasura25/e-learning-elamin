import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import { staggerContainer } from "@/utils/motion";
import LeftSidebar from "@/components/shared/superadmin/LeftSidebar";

const Layout = () => {
  return (
    <motion.div
      className="h-screen w-full background-image"
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
    >
      <Topbar />

      <main className="flex flex-row">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="content">
          <Outlet /> {/* This will render the child routes */}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">Right Sidebar</aside>
      </main>

      {/* Bottom Sidebar */}
      <footer className="bottom-sidebar">Bottom Sidebar</footer>
    </motion.div>
  );
};

export default Layout;
