import React,{useState,useEffect} from 'react'
import CustomTable from '../CustomTable'
import axios from "axios";
import './Category.css'
import { useNavigate } from 'react-router-dom';

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate()

    const limit = 10;

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.post('http://localhost:5000/getCategory', {
        page: currentPage,
        limit: limit,
      });
      setCategories(response.data.categories);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
};
    const handleAddcategory=()=>{
      navigate("/admin/addCategory");

    }
  return (
    <main className="main-container">
         <div className='list-category'>
            <h3>List of Category</h3>
            <button onClick={handleAddcategory}>Add new</button>
        </div>
        <CustomTable categories={categories} setCategories={setCategories} />
        <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> {currentPage} of {totalPages} </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
    </main>
  )
}

export default ListCategory