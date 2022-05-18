import axios from "axios";

const uuid = localStorage.getItem("uuid");

export async function search(searchStr: string) {
  return (await axios.get(`/contains/${searchStr}/${uuid}`)).data;
}

//Toutes les 5s on va regarder ce qu'il y a autour
export async function nearby(latbis: number, longbis: number) {
  // console.log("exploration de lat : " + latbis + " long : " + longbis);
  return (await axios.get(`/near/${latbis}/${longbis}/${uuid}`)).data;

  //setTimeout(nearby,10000);
}

//nearby(lat,long);

//fonction récupération de la note
//Entrée : nom du lieu ; Sortie : note moyenne du lieux

export async function showMark(nom: string) {
  // console.log("Quel est la moyenne de " + nom + " ?");
  return (await axios.get(`/noteM/${nom}`)).data;
}

//showMark("Cathedrale Sainte-Cecile");

//fonction ajouter une note
//Entrées : nom du lieu + note utilisateur + id utilisateur

export async function addMark(nom: string, note: number) {
  console.log("Ajout à " + nom + " la note " + note + " de la part de " + uuid);

  axios.post(`/addNote/${nom}/${note}/${uuid}`);
  return (await axios.get(`/noteM/${nom}`)).data; // Retourne la nouvelle moyenne
}
//addMark("Cathedrale Sainte-Cecile",4,4);
