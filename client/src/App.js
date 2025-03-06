import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

import LoginSignup from './components/user/LoginSignup';
import Forgotpassword from './components/user/Forgotpassword';
import Home from './components/user/Home'
import CoursePage  from './components/user/CoursePage';
import CustomTable from './components/admin/CustomTable';
import AdminRoutes from './components/admin/AdminRoutes';
import CourseDetailsPage from './components/user/CourseDetailsPage';



function App() {
  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tables' element={<CustomTable />}></Route>
        
        <Route path="/courses" element={<CoursePage />}></Route>
        <Route path="/courses/:courseId" element={<CourseDetailsPage />}></Route>
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
    </div>
 
  );
}

export default App;

