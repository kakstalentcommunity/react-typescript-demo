import { useState } from "react";

function AddStudent({ addStudent }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form inputs before adding a student
    if(!isFormValid()) {
      alert("Please fill in all fields");
      return;
    }

    addStudent(name, username, email, address, phone, website, company);

    clearInputs();
    setName("");
  };


  //function to make sure all the input fields are filled before adding a student
  const isFormValid = () => {
    return (id.trim() !== "" &&
      name.trim() !== "" &&
      username.trim() !== "" &&
        email.trim() !== "" &&
        address.trim() !== "" &&
        phone.trim() !== "" &&
        website.trim() !== "" &&
        company.trim() !== "");
  }

  const clearInputs = () => {
    setId("");
    setName("");
    setUsername("");
    setEmail("");
    setAddress("");
    setPhone("");
    setWebsite("");
    setCompany("");
  }
  return (
    <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder="Enter id"
        value={id}
        onChange={(e) => setId(e.target.value)}

      />
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

        <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

        <input
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

        <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

        <input
        type="text"
        placeholder="Enter phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

        <input
        type="text"
        placeholder="Enter website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <button>Add Student</button>
    </form>
  );
}
export default AddStudent;