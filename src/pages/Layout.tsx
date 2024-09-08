import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import { staggerContainer } from "@/utils/motion";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";

const Layout = () => {
  return (
    <motion.div
      className="h-screen w-full"
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
    >
      <Topbar />
      <main className="flex flex-row">
        <LeftSidebar />
        <section className="main-container">
          <Outlet />
        </section>
        <RightSidebar/>
      </main>
      <Bottombar />
    </motion.div>
  );
};

export default Layout;
