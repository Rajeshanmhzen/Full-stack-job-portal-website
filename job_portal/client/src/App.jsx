import { Outlet } from "react-router-dom";
import Navbar from "./Components/shared/NAvbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

export default App;
