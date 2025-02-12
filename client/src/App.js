import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

import LoginSignup from './components/LoginSignup';
import Forgotpassword from './components/Forgotpassword';
import Home from './components/Home'
import CoursePage  from './components/CoursePage';
import CustomTable from './components/admin/CustomTable';



function App() {
  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path="/courses" element={<CoursePage />} />
        <Route path='/tables' element={<CustomTable />}></Route>
      </Routes>
    </BrowserRouter>
    </div>
 
  );
}

export default App;

