import {Map} from "./Map"
import Search from "./Search"

const axios = require('axios');

function App() {
  return (
    <div>
      <header className="fixed-top">
        <Search onSubmit={(str) => {
          try {
            var res = document.getElementById("result");
            if((str === "") && (res != null)) res.hidden = true;
            else {
              const result = axios.get(`/contains/${str}`);
              result.then((resp : any) => {
                if(res != null) {
                  res.innerHTML = '';
                  res.hidden = false;
                  if(resp.data.length == 0) {
                    var div = document.createElement("div");
                    div.innerHTML = "Aucun résultat :/";
                    res.appendChild(div);
                  }
                  else
                    for(let k in resp.data) {
                      const div = document.createElement("div");
                      div.classList.add("select");
                      div.setAttribute("lat", resp.data[k][2]);
                      div.setAttribute("long", resp.data[k][3]);
                      const h4 = document.createElement("h4");
                      h4.innerHTML = resp.data[k][0];
                      const p = document.createElement("p");
                      p.innerHTML = resp.data[k][1];
                      div.appendChild(h4);
                      div.appendChild(p);
                      div.addEventListener('click', function(e) {
                          console.log(div.getAttribute("lat") + " " + div.getAttribute("long"));
                      });
                      res.appendChild(div);
                    }
                }
              });
            }
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
