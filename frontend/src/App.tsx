import { Provider } from "react-redux";
import store, { persistor } from "./store";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./components/pages/home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Competitions from "./components/pages/competitions";
import { PersistGate } from "redux-persist/integration/react";
import Documentation from "./components/pages/documentation";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import Dashboard from "./components/pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/competitions",
        element: <Competitions />,
      },
      {
        path: "/documentation",
        element: <Documentation />,
      },
      {
        path: '/competitions/:competition_id', 
        element: <Dashboard />
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
