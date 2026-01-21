import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import LoginFrom from "./components/auth/LoginFrom";
import RegForm from "./components/auth/RegForm";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import ChangePass from "./components/auth/ChangePass";
import Landingpage from "./components/LandingPage/LandingPage";
import About from './components/About';
import LandlordProfile from './components/profile/LandlordProfile';
import RoommateProfile from './components/profile/RoommateProfile';
import ProfileEdit from './components/profile/ProfileEdit';
import Auctionform from './components/customer/Auctionform';
import MyAccommodations from './components/customer/MyAccommodations';
import EditAccommodation from './components/customer/EditAccommodation';
import ManageBids from './components/customer/ManageBids';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/signup" element={<RegForm />} />
        <Route path="/login" element={<LoginFrom />} />
        <Route path="/changepass" element={<ChangePass />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile/landlord/:userId' element={<LandlordProfile />} />
        <Route path='/profile/roommate/:userId' element={<RoommateProfile />} />
        <Route path='/profile/edit' element={<ProfileEdit />} />
        <Route path='/post-accommodation' element={<Auctionform />} />
        <Route path='/my-accommodations' element={<MyAccommodations />} />
        <Route path='/edit-accommodation/:id' element={<EditAccommodation />} />
        <Route path='/manage-bids' element={<ManageBids />} />
      </Routes>
    </Router>
  );
}

export default App;
