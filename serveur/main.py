from contextlib import nullcontext
from flask import Flask, Response, request, jsonify, make_response
import json
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL
from urllib.parse import urlparse
from datetime import date, datetime

from requests import delete
import bdd

app = Flask(__name__)
api = Api(app)
mysql = MySQL()

app.config['MYSQL_DATABASE_HOST'] = bdd.ip
app.config['MYSQL_DATABASE_USER'] = bdd.user
app.config['MYSQL_DATABASE_PASSWORD'] = bdd.password
app.config['MYSQL_DATABASE_DB'] = bdd.database

mysql.init_app(app)

class near(Resource):
    def get(self,lat,long):

        print("latitude : " + lat)

        prox = 0.05 #float(request.args.get('prox'))
        
        latMoyenneM = float(lat)-prox
        latMoyenneP = float(lat)+prox
        longMoyenneM = float(long)-prox
        longMoyenneP = float(long)+prox
        
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = """SELECT
                        nom, adresse, latitude, longitude, description, image
                     FROM
                        Lieux
                     NATURAL JOIN
                        Visite
                     WHERE
                        (latitude BETWEEN """ + str(latMoyenneM) + " AND " + str(latMoyenneP) +""")
                     AND
                        (longitude BETWEEN """ + str(longMoyenneM) + " AND " + str(longMoyenneP)+")"
        cursor.execute(requete)
        data = cursor.fetchall()
        lst = []
        for d in data:
            tmp = dict()
            tmp.update({'nom': d[0]})
            tmp.update({'adresse': d[1]})
            tmp.update({'lat': d[2]})
            tmp.update({'long': d[3]})
            tmp.update({'desc': d[4]})
            tmp.update({'image': d[5]})
            lst.append(tmp)
        return jsonify(lst)

class contains(Resource):
    def get(self,str_w):
        #str_w = request.args.get('words')
        if str_w == None:
            return []
        words = str_w.split(" ") #urlparse(str_w).geturl().split(" ") str_w.split(" ")
        words_search = ""
        w = len(words)
        for i in range(w):
            if i == 0:
                words_search += "nom LIKE '%" + words[i] + "%' OR adresse LIKE '%" + words[i] + "%'"
            else:
                words_search += " OR nom LIKE '%" + words[i]+ "%' OR adresse LIKE '%" + words[i] + "%'"
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = """SELECT
                        nom, adresse, latitude, longitude, description, image
                     FROM
                        Lieux
                     WHERE """ + words_search
        cursor.execute(requete)
        data = cursor.fetchall()
        lst = []
        for d in data:
            tmp = dict()
            tmp.update({'nom': d[0]})
            tmp.update({'adresse': d[1]})
            tmp.update({'lat': d[2]})
            tmp.update({'long': d[3]})
            tmp.update({'desc': d[4]})
            tmp.update({'image': d[5]})
            lst.append(tmp)
        return jsonify(lst)

class noteMoyenne(Resource):
    def get(self,nom_l):
        #str_w = request.args.get('words')
        if nom_l == None:
            return []
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = """SELECT
                        note
                     FROM
                        Notation
                     WHERE nom=""" + '"' + nom_l + '"'
        cursor.execute(requete)
        data = cursor.fetchall()
        moy = 0
        for d in data:
            moy=moy+int(d[0])
        return (moy/len(data))

class ajouterNote(Resource):
    def post(self,nom_l,note,id):
        #l'utilisateur a t-il déja mis une note pour ce lieu ?
        connect = mysql.get_db()
        cursor = connect.cursor()
        requeteExiste = "SELECT * FROM Notation WHERE id=" + id + " AND nom=" + '"' + nom_l + '"'
        cursor.execute(requeteExiste)
        data=cursor.fetchall()
        if data : 
            print("update note")
            requeteUpdate = "UPDATE Notation SET id=" + id + ", nom=" + '"' + nom_l + '"' + ", note=" + note + " WHERE id=" + id + " AND nom=" + '"' + nom_l + '"'
            cursor.execute(requeteUpdate)
            connect.commit()
            return("modification réussi")
        else :
            print("data n'existe pas")
            #INSERT INTO `Notation`(`id`, `nom`, `note`) VALUES (4,"Cathédrale Sainte-Cécile",3)
            requeteInsert =  "INSERT INTO Notation (id, nom , note) VALUES ("+ id + ', "' + nom_l + '" ,' + note + ")"
            cursor.execute(requeteInsert)
            connect.commit()
            return ("insertion réussi")

api.add_resource(near, '/near/<lat>/<long>')
api.add_resource(contains, '/contains/<str_w>')
api.add_resource(noteMoyenne, '/noteM/<nom_l>')
api.add_resource(ajouterNote, '/addNote/<nom_l>/<note>/<id>')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
