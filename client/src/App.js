import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

import LoginSignup from './components/user/LoginSignup';
import Forgotpassword from './components/user/Forgotpassword';
import Home from './components/user/Home'
import CoursePage  from './components/user/CoursePage';
import CustomTable from './components/admin/CustomTable';



function App() {
  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path="/courses" element={<CoursePage />}></Route>
        <Route path='/tables' element={<CustomTable />}></Route>
      </Routes>
    </BrowserRouter>
    </div>
 
  );
}

export default App;

