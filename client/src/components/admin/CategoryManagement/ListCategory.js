import React,{useState,useEffect} from 'react'
import CustomTable from '../CustomTable'
import axios from "axios";
import './Category.css'
import { useNavigate } from 'react-router-dom';

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        axios
          .post("http://localhost:5000/getCategory")
          .then((response) => {
            setCategories(response.data);
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });
      }, []);

    const handleAddcategory=()=>{
      navigate("/admin/addCategory");

    }
  return (
    <main className="main-container">
         <div className='list-category'>
            <h3>List of Category</h3>
            <button onClick={handleAddcategory}>Add new</button>
        </div>
        <CustomTable categories={categories} setCategories={setCategories}/>
    </main>
  )
}

export default ListCategory