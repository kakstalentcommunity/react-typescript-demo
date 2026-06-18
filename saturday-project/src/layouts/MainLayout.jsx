import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Student from "../pages/Student";
import Footer from '../components/Footer';


function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />

                
                <Student />
                <Footer />
            </div>
        </div>
    )
}

export default MainLayout;