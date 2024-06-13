import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';

const App: React.FC = () => {
	return (
		<Router>
			<div>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/add-task' element={<AddTask />} />
					<Route path='/edit-task/:id' element={<EditTask />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
