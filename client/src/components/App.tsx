import {Map} from "./Map"
import Search from "./Search"

function App() {
  return (
    <div>
      <header className="fixed-top">
        <Search onSubmit={(str) => {
          console.log(str);
        }} />
      </header>
      <Map />
      <div>

      </div>
    </div>
  );
}

export default App;
