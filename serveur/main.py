from contextlib import nullcontext
from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flaskext.mysql import MySQL


app = Flask(__name__)
api = Api(app)
mysql = MySQL()

app.config['MYSQL_DATABASE_HOST'] = '5.189.183.247'
app.config['MYSQL_DATABASE_USER'] = 'geotourisme'
app.config['MYSQL_DATABASE_PASSWORD'] = '7`Yxv<{_e*&/{QZm'
app.config['MYSQL_DATABASE_DB'] = 'geotourisme'

mysql.init_app(app)

class recuperation(Resource):
    def get(self):
        iduser = request.args.get('id')
        print("nom" + iduser)
        connect = mysql.get_db()
        cursor = connect.cursor()
        requete = "SELECT * from Users where id='" + iduser + "'"
        cursor.execute(requete)
        data = cursor.fetchone() 
        
        return data

    def post(self):
        return self

    def delete(self):
        return self

api.add_resource(recuperation, '/connect')
if __name__ == '__main__':
    app.run(debug=True)
