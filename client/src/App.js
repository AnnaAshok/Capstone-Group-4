import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginSignup from './LoginSignup';
import Header from './Header';
import Footer from './Footer';

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