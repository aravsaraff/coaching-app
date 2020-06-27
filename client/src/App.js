import React from 'react';
import { useLocalStore, useObserver } from 'mobx-react';
import StoreContext from './StoreContext';
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
			<div className='App'>Hello, world!</div>
		</StoreProvider>
	);
}

export default App;
