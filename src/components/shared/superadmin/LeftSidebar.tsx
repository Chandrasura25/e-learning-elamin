import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { sidebarLinks, supervisorSidebarLinks } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
function LeftSidebar() {
  const { pathname } = useLocation();
  const [links, setLinks] = useState([]);
  const { logout, user, role } = useAuth();
  useEffect(() => {
    const selectedSidebarLinks = role === "superadmin" ? supervisorSidebarLinks : sidebarLinks;

    const updatedLinks = selectedSidebarLinks.map((link) => {
      const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
      let route = link.route;
      if (link.route === "/profile") route = `${link.route}/${role}/${user?.id}`;
      return { ...link, isActive, route };
    });
    setLinks(updatedLinks);
  }, [pathname, user?.id, role]);

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {links.map((link) => (
          <Link
            to={link.route}
            key={link.label}
            className={`leftsidebar_link ${link.isActive && "bg-red-600"}`}
          >
            <img src={link.imgURL} alt={link.label} width={24} height={24} />
            <p className="text-light-1 max-lg:hidden">{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 px-6">
        <div>
          <button onClick={() => logout(role)}>
            <div className="flex cursor-pointer gap-4 p-4">
              <img
                src="/images/logout.svg"
                height={24}
                width={24}
                alt="logout"
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

export default LeftSidebar;
