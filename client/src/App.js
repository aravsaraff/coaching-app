import React from 'react';
import { useLocalStore } from 'mobx-react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import StoreContext from './StoreContext';
import { Home, Header, Register, Login } from './components';
import './App.scss';

const StoreProvider = ({ children }) => {
	const store = useLocalStore(() => ({
		// Add some app level state here
	}));

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

function App() {
	return (
		<StoreProvider>
			<Router>
				<div className='App'>
					<Header />
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/register' component={Register} />
						<Route path='/login' component={Login} />
					</Switch>
				</div>
			</Router>
		</StoreProvider>
	);
}

export default App;
