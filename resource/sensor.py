from argparse import Action
from datetime import datetime
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from sqlalchemy import null
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import json
from models.rawdata import RawdataModel
from models.sensor import SensorModel
from models.datarogger import DataroggerModel


import logging

class sensor(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('sensor_id', type=str)
    parse.add_argument('sensor_name', type=str)
    parse.add_argument('sensor_display_name', type=str)
    parse.add_argument('sensor_sn', type=str)
    parse.add_argument('sensor_type', type=str)
    parse.add_argument('sensor_interval', type=str)
    parse.add_argument('sensor_index', type=str)
    parse.add_argument('use_yn', type=str)

    parse.add_argument('user_id', type=str)
    parse.add_argument('sensorgroup_id', type=str)
    parse.add_argument('datarogger_id', type=str)
    parse.add_argument('sensorgroup_id', type=str)
    parse.add_argument('sensor_display_index', type=str)
    

    def get(self):

        datarogger_id =              request.args.get('datarogger_id')
  
        sensor_data = [dict(r) for r in SensorModel.find_by_datarogger_id(datarogger_id)]
        # sensor_data = SensorModel.find_by_datarogger_id(datarogger_id)
        # print(sensor_data)
       

        datarogger_data = [dict(r) for r in RawdataModel.datarogger_sensor_list(datarogger_id)]

        if(len(sensor_data) != len(datarogger_data)):
            

            create_date = datetime.now()
            modify_date = datetime.now()

            user_id = current_user.user_id

            try:
                for i in range(len(datarogger_data)):
                    
                    # print(datarogger_data[i]["sensor_name"])
                    # print(datarogger_data[i]["sensor_index"])

                    
                    sensor_name = datarogger_data[i]["sensor_name"]
                    sensor_index = datarogger_data[i]["sensor_index"]

                    sensor_obj = SensorModel.find_by_datarogger_id_sensorname(sensor_name, datarogger_id)
                    if sensor_obj is None :
                        sensor_obj = SensorModel(sensor_name, sensor_name, None, 'single', None, sensor_index, sensor_index, 'Y', user_id, None, datarogger_id, create_date, modify_date)
                        sensor_obj.save_to_db()
                    

                    # sensor_obj = SensorModel(sensor_name, sensor_name, None, 'x', None, sensor_index, sensor_index, 'Y', user_id, None, datarogger_id, create_date, modify_date)
                    # sensor_obj.save_to_db()

                sensor_data = [dict(r) for r in SensorModel.find_by_datarogger_id(datarogger_id)]
                return {'resultCode': '0', "resultString": "SUCCESS", "data":sensor_data}, 200

            except Exception as e:

                logging.fatal(e, exc_info=True)
                return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS", "data":sensor_data}, 200

    def post(self):
        # params = sensor.parse.parse_args()
        # print("!!!!")
        # print(params)

        jsonData = request.get_json()

        # print(jsonData)
           
        try:
            datarogger_id =SensorModel.find_by_id(jsonData[0]["sensor_id"]).datarogger_id
           
            datarogger_obj = DataroggerModel.find_by_id(datarogger_id)
            datarogger_obj.project_id = jsonData[0]['project_id']
            datarogger_obj.save_to_db()
            for i in range(len(jsonData)):
                
                # print(jsonData[i]["sensor_name"])
                # print(jsonData[i]["sensor_id"])
                # print(jsonData[i]["sensor_display_index"])
            

                sensor_display_name = jsonData[i]["sensor_display_name"]
                sensor_index = jsonData[i]["sensor_index"]
                sensor_sn = jsonData[i]["sensor_sn"]
                sensor_type = jsonData[i]["sensor_type"]
                sensor_id = jsonData[i]["sensor_id"]
                sensor_display_index = jsonData[i]["sensor_display_index"]
                use_yn = jsonData[i]["use_yn"]

                # print(sensor_id)

                sensor_obj = SensorModel.find_by_id(sensor_id)

                sensor_obj.sensor_display_name = sensor_display_name
                sensor_obj.sensor_index = sensor_index
                sensor_obj.sensor_sn = sensor_sn
                sensor_obj.sensor_type = sensor_type
                sensor_obj.sensor_display_index = sensor_display_index
                sensor_obj.use_yn = use_yn

                # sensor_obj = SensorModel(sensor_name, None, 'x', None, sensor_index, 'Y', user_id, None, datarogger_id, create_date, modify_date)
                sensor_obj.save_to_db()

            # sensor_data = [dict(r) for r in SensorModel.find_by_datarogger_id(datarogger_id)]
            return {'resultCode': '0', "resultString": "SUCCESS"}, 200

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "SUCCESS"}, 200
    


class sensorleftmenu(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('sensor_id', type=str)
    parse.add_argument('project_id', type=str)

    def get(self):


        project_id =              request.args.get('project_id')
        data = [dict(r) for r in SensorModel.left_menu(project_id)]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



class all_sensor_setting(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('project_id', type=str)

    def get(self):


        project_id =              request.args.get('project_id')
        data = [dict(r) for r in SensorModel.all_sensor_setting(project_id)]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



class SensorlistGroup(Resource) :

    parse = reqparse.RequestParser()

    parse.add_argument('sensor_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('sensorgroup_id', type=str)

    def get(self):


        sensorgroup_id =    request.args.get('sensorgroup_id')
        data = [dict(r) for r in SensorModel.all_sensor_list(sensorgroup_id)]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200