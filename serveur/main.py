from contextlib import nullcontext
from flask import Flask, Response, request, jsonify, make_response
import json
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL
from urllib.parse import urlparse
from datetime import date, datetime

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
    def get(self,lat,long, id):

        print("latitude : " + lat)

        prox = 0.002 #float(request.args.get('prox'))
        
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
            tmp.update({'note': getMoyen(d[0])})
            if id != None :
                requeteNote = """SELECT
                                    note
                                 FROM
                                    Notation
                                 WHERE 
                                    id=\""""+id+ "\" AND nom=\"" + d[0] + "\""
                cursor.execute(requeteNote)
                uNote=cursor.fetchall()
                if uNote :
                    tmp.update({'userNote': uNote[0][0]})
            lst.append(tmp)
        return jsonify(lst)

class containsNoId(Resource):
    def get(self,str_w):
        return contains().get(str_w, None)

class containsNoStr(Resource):
    def get(self,id):
        return contains().get(None, id)

class contains(Resource):
    def get(self,str_w,id):
        #str_w = request.args.get('words')
        if str_w != None:
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
        if str_w == None:
            requete = """SELECT
                        nom, adresse, latitude, longitude, description, image
                     FROM
                        Lieux"""
        else:
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
            tmp.update({'note': getMoyen(d[0])})
            if id != None :
                requeteNote = """SELECT
                                    note
                                 FROM
                                    Notation
                                 WHERE 
                                    id=\""""+id+ "\" AND nom=\"" + d[0] + "\""
                cursor.execute(requeteNote)
                uNote=cursor.fetchall()
                if uNote :
                    tmp.update({'userNote': uNote[0][0]})
            lst.append(tmp)
        return jsonify(lst)

def getMoyen(nom_l) : 
    #str_w = request.args.get('words')
    if nom_l == None:
        return 0
    connect = mysql.get_db()
    cursor = connect.cursor()
    requete = """SELECT
                    note
                    FROM
                    Notation
                    WHERE nom=""" + '"' + nom_l + '"'
    cursor.execute(requete)
    data = cursor.fetchall()
    if len(data) == 0 :
        return 0
    moy = 0
    for d in data:
        moy=moy+int(d[0])
 
    return (moy/len(data))

def getNear(lat,long):
    print("latitude : " + lat)

    prox = 0.05 #float(request.args.get('prox'))
        
    latMoyenneM = float(lat)-prox
    latMoyenneP = float(lat)+prox
    longMoyenneM = float(long)-prox
    longMoyenneP = float(long)+prox
        
    connect = mysql.get_db()
    cursor = connect.cursor()
    requete = """SELECT
                    nom
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
    return data

class noteMoyenne(Resource):
    def get(self,nom_l): 
        return getMoyen(nom_l)

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

class newUserId(Resource):
    def get(self):
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = """SELECT
                        id
                     FROM
                        Users"""
        cursor.execute(requete)
        data = cursor.fetchall()
        newId = len(data) + 1
        requeteNewUser = """INSERT INTO
                                Users (id)
                            VALUES (""" + str(newId) + ")"
        cursor.execute(requeteNewUser)
        connect.commit()
        return newId

class visites(Resource):
    def get(self,lat,long, id):
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = "DELETE FROM Visite WHERE id=\"" + id + "\""
        cursor.execute(requete)

        lieux = getNear(lat,long)
        for l in lieux:
            requeteAdd = "INSERT Visite (id, nom) VALUES(" + id + ", " + l[0] + ")" 
        cursor.execute(requeteAdd)

        connect.commit()

        requeteVisites = """
                            SELECT
                              nom,
                              COUNT(*) AS `num`
                            FROM
                              Visite
                            GROUP BY
                              nom
                          """
        cursor.execute(requeteVisites)
        data = cursor.fetchall()
        lst = []
        for d in data:
            tmp = dict()
            tmp.update({'nom': d[0]})
            tmp.update({'num': d[1]})
            lst.append(tmp)
        return jsonify(lst)

api.add_resource(near, '/near/<lat>/<long>/<id>')
api.add_resource(contains, '/contains/<str_w>/<id>')
api.add_resource(containsNoId, '/contains/<str_w>')
api.add_resource(containsNoStr, '/all/<id>')
api.add_resource(noteMoyenne, '/noteM/<nom_l>')
api.add_resource(ajouterNote, '/addNote/<nom_l>/<note>/<id>')
api.add_resource(newUserId, '/newUser/')
api.add_resource(visites, '/visites/<lat>/<long>/<id>')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
