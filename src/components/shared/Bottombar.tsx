import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { sidebarLinks, supervisorSidebarLinks } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

function Bottombar() {
  const { pathname } = useLocation();
  const [links, setLinks] = useState([]);
  const { user, role } = useAuth();
  useEffect(() => {
    const selectedSidebarLinks =
      role === "counsellor" ? supervisorSidebarLinks : sidebarLinks;

    const updatedLinks = selectedSidebarLinks.map((link) => {
      const isActive =
        (pathname.includes(link.route) && link.route.length > 1) ||
        pathname === link.route;
      let route = link.route;
      if (link.route === "/profile")
        route = `${link.route}/${role}/${user?.id}`;
      return { ...link, isActive, route };
    });
    setLinks(updatedLinks);
  }, [pathname, user?.id, role]);

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {links.map((link) => (
          <Link
            to={link.route}
            key={link.label}
            className={`bottombar_link ${link.isActive && "bg-red-600"} ${
              link.route === "/create-post" ? "post-btn" : ""
            }`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={link.route === "/create-post" ? 32 : 24}
              height={link.route === "/create-post" ? 32 : 24}
            />
            <p className="text-subtle-medium text-light-1 max-sm:hidden">
              {link.label.split(/\s+/)[0]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Bottombar;
