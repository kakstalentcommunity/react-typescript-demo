function StudentCard({ student, deleteStudent }) {
  return (
    <div className="card">
      <h3>{student.name}</h3>

      <button onClick={() => deleteStudent(student.id)}>
        Delete
      </button>
    </div>
  );
}

export default StudentCard;