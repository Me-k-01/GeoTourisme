import {Map} from "./Map"
import Search from "./Search"

function App() {
  return (
    <div>
      <Map />
      <div>
        <Search onSubmit={(str) => {
          console.log(str);
        }} />
      </div>
    </div>
  );
}

export default App;
