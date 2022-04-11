//importing react-icons
import { FcChargeBattery } from "react-icons/fc"
//using another react icons
import {FiArrowDown } from "react-icons/fi"
function App() {
  return (
     <div>
       <h1 className="text-center text-danger"><FiArrowDown className="text-info"/>This is connecting the react with server<FcChargeBattery/></h1>
       <p className="lead">hi this is happy to say that you success full connet the react application with nodejs</p>
     </div>
  );
}

export default App;
