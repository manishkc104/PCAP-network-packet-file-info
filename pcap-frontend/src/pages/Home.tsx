import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PacketList from "./PacketList";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Graph from "./Graph";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [opened, { toggle }] = useDisclosure();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppShell
          header={{ height: 50 }}
          navbar={{
            width: 250,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <Sidebar />
          </AppShell.Navbar>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      ),
      children: [
        { path: "/", element: <PacketList /> },
        { path: "/graph", element: <Graph /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Home;
