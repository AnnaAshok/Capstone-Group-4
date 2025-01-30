import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginSignup from './components/LoginSignup';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    < div className='App'>
    <Header/>
    <LoginSignup/>
    <Footer/>
    </div>
 
  );
}

export default App;



 // <div className="App">
    //  {/* EduSphere */}
    //  <Signup/>
    // </div>
 //  <BrowserRouter>
  //  <Routes>
  //   <Route path='/' element={<LoginSignup/>}></Route>
  //  </Routes>
  //  </BrowserRouter>