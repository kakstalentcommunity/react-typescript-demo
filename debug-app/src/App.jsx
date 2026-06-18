import { useEffect, useState } from "react";
import StudentList from "./components/StudentList";
import SearchBar from "./components/SearchBar";
import AddStudent from "./components/AddStudent";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    const data = await response.json();

    setStudents(data);
    console.log(data)
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  const addStudent = (studentName) => {
    const newStudent = {
      id: Date.now(),
      name: studentName,
    };

    const updatedStudents = [...students, newStudent];

    setStudents(updatedStudents);
    console.log(updatedStudents)
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter(
      (student) => student.id !== id
    );
    setStudents(updatedStudents);
  };

  return (
    <div className="container">
      <h1>Student Dashboard</h1>

      <h2>Total Students: {students.length}</h2>

      <SearchBar search={search} setSearch={setSearch} />

      <AddStudent addStudent={addStudent} />

      <StudentList
        students={filteredStudents}
        deleteStudent={deleteStudent}
      />
    </div>
  );
}

export default App;