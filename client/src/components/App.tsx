import {Map} from "./Map"
import Search from "./Search"

const axios = require('axios');

function App() {
  return (
    <div>
      <header className="fixed-top">
        <Search onSubmit={(str) => {
          try {
            const result = axios.get(`/contains/${str}`);
            result.then((resp : any) => 
              console.log(resp)
            );
          } catch (err){
            console.log(err);
          }
        }} />
      </header>
      <Map />
      <div>

      </div>
    </div>
  );
}

export default App;
