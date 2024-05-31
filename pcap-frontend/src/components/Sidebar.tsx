import { NavLink } from "@mantine/core";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <NavLink
        component={RouterNavLink}
        to="/"
        label="Packet List"
        active={location.pathname === "/"}
      />
      <NavLink
        component={RouterNavLink}
        to="/flaggedPackets"
        label="Flagged Packets"
        active={location.pathname === "/flaggedPackets"}
      />
      <NavLink
        component={RouterNavLink}
        to="/graph"
        label="Graph"
        active={location.pathname === "/graph"}
      />
      
    </>
  );
};

export default Sidebar;
