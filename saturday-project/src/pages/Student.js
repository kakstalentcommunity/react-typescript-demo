import { useState } from "react";

function Student() {
    const [studentName, setStudentName] = useState([]);
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");
    const [editingStudentId, setEditingStudentId] = useState(null);


//add student function
    const addStudent = () => {
        if (editingStudentId !== null) {
            const updatedStudents = studentName.map((student) =>
                student.id === editingStudentId
                    ? { ...student, name, course }
                    : student
            );
            setStudentName(updatedStudents);
            setEditingStudentId(null);
        } else {
            const newStudent = {
                id: Date.now(),
                name: name,
                course: course
            };

            setStudentName([...studentName, newStudent]);
        }

        setName("");
        setCourse("");
    }

    //delete student function
    const deleteStudent = (id) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${studentName.find((student) => student.id === id)?.name} ?`);

        if (confirmDelete) {
            const filteredStudents = studentName.filter(
                (student) => student.id !== id
            );
            setStudentName(filteredStudents);
        }
    }


    //edit student details function
    const editStudent = (student) => {
      setName(student.name)
      setCourse(student.course)
      setEditingStudentId(student.id)
    }



    return(
        <div>
            <h1>Student Management</h1>


            <div className="student-form">
  <input
    type="text"
    placeholder="Enter student name"
    value={name}
    onChange={(event) => setName(event.target.value)}
  />

  <input
    type="text"
    placeholder="Enter course"
    value={course}
    onChange={(event) => setCourse(event.target.value)}
  />

  <button onClick={addStudent}>{editingStudentId !== null ? "Save Changes" : "Add Student"}</button>  
</div>
  
   <div className="students-list">
        {studentName.map((student) => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>

            <p>{student.course}</p>

            <button
              onClick={() => deleteStudent(student.id)}
            >
              Delete
            </button>

            {/*edit button*/}
            <button onClick={() => editStudent(student)}>Edit</button>
          </div>
        ))}  
      </div>
      </div>
    )
}
export default Student;