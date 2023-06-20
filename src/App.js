
import './App.css';
import { Provider } from 'react-redux';
import Uipage from './Uipage';
import store from './store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
       <Uipage/>
      </Provider>
    
    </div>
  );
}

export default App;
