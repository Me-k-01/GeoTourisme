import axios from "axios";

export async function search(searchStr: string) {
  return (await axios.get(`/contains/${searchStr}/${await getUserId()}`)).data;
}

//Toutes les 5s on va regarder ce qu'il y a autour
export async function nearby(latbis: number, longbis: number) {
  // console.log("exploration de lat : " + latbis + " long : " + longbis);
  try {
    return (await axios.get(`/near/${latbis}/${longbis}`)).data; 
  } catch (err) {
    console.error(err);
  }

  //setTimeout(nearby,10000);
}

//nearby(lat,long);

//fonction récupération de la note
//Entrée : nom du lieu ; Sortie : note moyenne du lieux

export async function showMark(nom: string) {
  // console.log("Quel est la moyenne de " + nom + " ?");
  try {
    return (await axios.get(`/noteM/${nom}`)).data;
  } catch (err) {
    console.error(err);
  }
}

//showMark("Cathedrale Sainte-Cecile");

//fonction ajouter une note
//Entrées : nom du lieu + note utilisateur + id utilisateur

export async function addMark(nom: string, note: number) {
  const uid = await getUserId();
  console.log("Ajout à " + nom + " la note " + note + " de la part de " + uid);

  try {
    axios.post(`/addNote/${nom}/${note}/${uid}`);
    return (await axios.get(`/noteM/${nom}`)).data // Retourne la nouvelle moyenne
  } catch (err) {
    console.error(err);
  }
}
//addMark("Cathedrale Sainte-Cecile",4,4);

//fonction récupération de l'user id
export async function getUserId() {
    var uid = localStorage.getItem('uuid');
    if (uid)
        return +uid;
    return await axios.get(`/newUser/`).then((uuid) => {
        localStorage.setItem('uuid', uuid.data);
        return +uuid.data;
    });
};