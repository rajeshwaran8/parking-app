import AddSlot from '../Slot/AddSlot';
import Admin from './Admin';
import AdminNav from './AdminNav';
import AdminSlotView from './AdminSlotView';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function AdminRoute() {

  return (
    <Router>
      <AdminNav />
      <Routes>
        <Route path='/admin/add-slot' element={<AddSlot />} />
        <Route path='/admin/show-slot' element={<AdminSlotView />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/show-slot-admin' element={<AdminSlotView />} />
      </Routes>
    </Router>
  );
}

export default AdminRoute;