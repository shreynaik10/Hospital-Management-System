import './css/App.css';
import HomePage from './HomePage';
import { UserContextProvider } from './Context/UserContext';


function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <HomePage/>
      </UserContextProvider>
    </div>
  );
}

export default App;
