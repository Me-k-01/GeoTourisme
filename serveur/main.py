from contextlib import nullcontext
from flask import Flask, request
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
    def get(self):
        try:
            latitude = float(request.args.get('lat'))
            longitude = float(request.args.get('long'))
        except TypeError:
            return []
        try:
            prox = float(request.args.get('prox'))
        except TypeError:
            prox = 0.001
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = """SELECT
                        nom, adresse, latitude, longitude, id
                     FROM
                        Lieux
                     NATURAL JOIN
                        Visite
                     WHERE
                        (latitude BETWEEN """ + str(latitude-prox) + " AND " + str(latitude+prox) +""")
                     AND
                        (longitude BETWEEN """ + str(longitude-prox) + " AND " + str(longitude+prox)+")"
        cursor.execute(requete)
        data = cursor.fetchall()
        return list(data)

    def post(self):
        return self

    def delete(self):
        return self

class contains(Resource):
    def get(self):
        str_w = request.args.get('words')
        if str_w == None:
            return []
        words = urlparse(str_w).geturl().split(" ") #str_w.split(" ")
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
                        nom, adresse, latitude, longitude
                     FROM
                        Lieux
                     WHERE """ + words_search
        cursor.execute(requete)
        data = cursor.fetchall()
        return list(data)

    def post(self):
        return self

    def delete(self):
        return self

api.add_resource(near, '/near')
api.add_resource(contains, '/contains')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
