import React from "react"
import RouteList from "./RouteList"
import { UserProvider } from "./context/user";


function App() {
  return <UserProvider>
    <RouteList />
  </UserProvider>
}

export default App;
