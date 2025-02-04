import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginSignup from './components/LoginSignup';
import Header from './components/Header';
import Footer from './components/Footer';
import Forgotpassword from './components/Forgotpassword';
import Home from './components/Home'


function App() {
  return (
    <div className='App'>
    {/* <Header/>
    <Footer/> */}
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/home' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
    </div>
 
  );
}

export default App;

