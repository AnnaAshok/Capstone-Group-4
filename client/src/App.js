import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'

import LoginSignup from './components/user/LoginSignup';
import Forgotpassword from './components/user/Forgotpassword';
import Home from './components/user/Home'
import CoursePage  from './components/user/CoursePage';
import CustomTable from './components/admin/CustomTable';
import AdminRoutes from './components/admin/AdminRoutes';
import Profile from './components/user/profile';
import CourseDetailsPage from './components/user/CourseDetailsPage';
import Quiz from './components/user/Quiz';



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
        {/* <Route path="/admin/*" element={<ProtectedRoute element={<AdminRoutes />} />}></Route> */}

        <Route path="/profile" element={<Profile />}></Route>
        
        <Route path='/quiz' element={<Quiz />} />
      </Routes>
    </BrowserRouter>
    </div>
 
  );
}

export default App;

