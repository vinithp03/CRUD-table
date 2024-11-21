import React, { useEffect, useRef, useState } from 'react'
import "./DataTable.css"

const DataTable = () => {
  const [userDetails, setUserdetails] = useState([]);
  const [serachterm, SetSerachterm] = useState("");
  const [editId, setEditId] = useState(false);
  const [currentpage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastItem = currentpage * itemsPerPage;
  const firstItem = lastItem - itemsPerPage;

  const filteredItems = userDetails.filter((ele) => ele.name.toLowerCase().includes(serachterm.toLowerCase()));
  const filtereddata = filteredItems.slice(firstItem, lastItem);

  const nameRef = useRef();
  const ageRef = useRef();
  const genderRef = useRef();
  const clickedOutside = useRef(false);

  useEffect(() => {
    if (!editId) return;

    const selectedItems = document.querySelectorAll(`[id='${editId}']`);
    selectedItems[0].focus();

  }, [editId]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clickedOutside.current && !clickedOutside.current.contains(e.target)) {
        setEditId(false);
      }

    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [serachterm]);

  const handlePagination = (pageNo) => {
    setCurrentPage(pageNo);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    let id = Date.now();
    let name = nameRef.current.value;
    let age = ageRef.current.value;
    let gender = genderRef.current.value;
    setUserdetails(prev => [...prev, { id, name, gender, age }]);
    nameRef.current.value = "";
    ageRef.current.value = "";
    genderRef.current.value = "";
  }

  const handleDelete = (id) => {
    if (filtereddata.length == 1 && currentpage != 1) setCurrentPage(prev => prev - 1);
    let newDetails = userDetails.filter((ele, i) => {
      return ele.id !== id;
    })
    setUserdetails(newDetails);
  }
  const handleFilter = (e) => {
    SetSerachterm(e.target.value)
  }

  const handleEdit = (id, updatedData) => {
    if (!editId || editId !== id) return;

    let updatedList = userDetails.map((ele) => {
      return ele.id === id ? { ...ele, ...updatedData } : ele;
    })
    setUserdetails(updatedList);
  }

  return (
    <>
      <center>
        <h2><span style={{ color: "red" }}>Reactive </span>TABLE</h2>
        < div className='add-container' >
          <form onSubmit={handleSubmit} className='form-container'>
            <div className="input-group">
              <input type="text" placeholder='Name' required ref={nameRef} />
              <input type="text" placeholder='Gender' required ref={genderRef} />
              <input type="number" placeholder='Age' required ref={ageRef} />
            </div>
            <button className='add-btn'>ADD</button>
          </form>
        </div >


        <div className='table-container'>
          <input type="text" placeholder='Search by name' onChange={handleFilter} />
          {filtereddata.length > 0 ? <table className='data-table' cellPadding={5} cellSpacing={5} ref={clickedOutside}>
            <thead>
              <tr className='headings'>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtereddata.map((ele) => {
                return (
                  <tr key={ele.id}>
                    <td id={ele.id} contentEditable={editId === ele.id} onBlur={(e) => handleEdit(ele.id, { name: e.target.innerText })}>{ele.name}</td>
                    <td id={ele.id} contentEditable={editId === ele.id} onBlur={(e) => handleEdit(ele.id, { gender: e.target.innerText })}>{ele.gender}</td>
                    <td id={ele.id} contentEditable={editId === ele.id} onBlur={(e) => handleEdit(ele.id, { age: e.target.innerText })}>{ele.age}</td>
                    <td >
                      <button className='edit' onClick={() => setEditId(ele.id)}>EDIT</button>
                      <button className='delete' onClick={() => handleDelete(ele.id)}>DELETE</button>
                    </td>
                  </tr>);
              })
              }
            </tbody>
          </table> : <h4>No data found</h4>}
          {filtereddata.length > 0 && <div className='pagination'>{
            Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => {
              return (<button key={i + 1} onClick={() => handlePagination(i + 1)} style={{ backgroundColor: currentpage === i + 1 && "lightgreen", border: "none", marginLeft: "5px", }}>{i + 1}</button>)
            })}</div>}
        </div>
      </center>
    </>
  );
};

export default DataTable;

