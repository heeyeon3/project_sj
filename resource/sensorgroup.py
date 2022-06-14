from argparse import Action
from datetime import datetime
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from sqlalchemy import null
from models.sensordetail import SensorDetailModel
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import json
from models.rawdata import RawdataModel
from models.sensor import SensorModel
from models.sensorgroup import SensorgroupModel
import logging
from models.editdata import EditdataModel

class Sensorgroup(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('sensorgroup_id', type=str)
    parse.add_argument('project_id', type=str)

    def get(self):

        project_id =              request.args.get('project_id')
    
        data = [dict(r) for r in SensorgroupModel.find_by_project_id(project_id)]
     
        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200


    def post(self):

        jsonData = request.get_json()

        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()

        try:

            for i in range(len(jsonData)):

                sensorgroup_id = jsonData[i]["sensorgroup_id"]
                sensorgroup_name = jsonData[i]["sensorgroup_name"]
                sensorgroup_type = jsonData[i]["sensorgroup_type"]
                sensorgroup_index = jsonData[i]["sensorgroup_index"]
                sensorgroup_interval = jsonData[i]["sensorgroup_interval"]
                use_yn = jsonData[i]["use_yn"]
                place_id = jsonData[i]["place_id"]
                
                use_yn = jsonData[i]["use_yn"]
                project_id = jsonData[i]["project_id"]

                if len(sensorgroup_id) == 0:
                    sensorgroup_obj = SensorgroupModel(sensorgroup_name, sensorgroup_type, sensorgroup_index, None, None, None, None, None, None, None,  sensorgroup_interval, None, '0.002' ,use_yn, user_id, place_id, project_id,create_date, modify_date)
                    sensorgroup_obj.save_to_db()

                else:
                    sensorgroup_obj = SensorgroupModel.find_by_id(sensorgroup_id)

                    sensorgroup_obj.sensorgroup_name = sensorgroup_name
                    sensorgroup_obj.sensorgroup_type = sensorgroup_type
                    sensorgroup_obj.sensorgroup_index = sensorgroup_index
                    sensorgroup_obj.sensorgroup_interval = sensorgroup_interval
                    sensorgroup_obj.use_yn = use_yn
                    sensorgroup_obj.place_id = place_id
                    sensorgroup_obj.modify_date = modify_date

                    sensorgroup_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200



class Sensorgroupmapping(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('sensorgroup_initial_date', type=str)
    parse.add_argument('sensorgroup_id', type=str)
    parse.add_argument('project_id', type=str)

    def get(self):

        print("Sensorgroupmapping")
        project_id =              request.args.get('project_id')
        sensorgroup_id =              request.args.get('sensorgroup_id')
    
        data = [dict(r) for r in SensorgroupModel.sensorgroup_mapping_sensor(project_id, sensorgroup_id)]
     

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):

        params = Sensorgroupmapping.parse.parse_args()
        # print(params)

        sensorgroup_id = params['sensorgroup_id']
        sensorgroup_initial_date = params['sensorgroup_initial_date']

        print(sensorgroup_initial_date)

        sensorgroup_initial_date_1 = sensorgroup_initial_date[0:4]+"-"+sensorgroup_initial_date[5:7]+"-"+sensorgroup_initial_date[8:10]+" "+sensorgroup_initial_date[11:16]
        print(sensorgroup_initial_date_1)

        sensor_list = [dict(r) for r in SensorModel.all_sensor_list(sensorgroup_id)]

        datarogger_id = str(sensor_list[0]['datarogger_id'])
        print(datarogger_id)

        sensor_first = [dict(r) for r in EditdataModel.find_sensor_first_data(datarogger_id,sensorgroup_initial_date_1)]
        print(sensor_first)
        if len(sensor_first) == 0:
            return {'resultCode': '0', "resultString": "선택하신 날짜에 데이터 존재하지 않아 설정을 완료할수 없습니다."}, 200

        else:
            sensor_initila_date =sensor_first[0]['sensor_data_date']

        try:
            for i in range(len(sensor_list)):
                sensor_id = sensor_list[i]['sensor_id']
                sensor_name = sensor_list[i]['sensor_name']
                datarogger_id = sensor_list[i]['datarogger_id']
                
                sensor_obj = SensorDetailModel.find_by_sensor_id(str(sensor_id))

            
                sensor_detail_id = sensor_obj.sensor_detail_id
                sensor_detail_obj = SensorDetailModel.find_by_id(sensor_detail_id)
                sensor_detail_obj.sensor_initial_date = sensor_initila_date

                param = (sensor_name, str(datarogger_id), sensor_initila_date)

                sensordata = [dict(r) for r in EditdataModel.find_initial_data(param)]
              
                if(len(sensordata)>0):
                    sensor_initial_data = sensordata[0]['sensor_data']
                   
                    sensor_detail_obj.sensor_initial_data = sensor_initial_data
                else:
                    sensor_detail_obj.sensor_initial_data = None

                # sensor_detail_obj.save_to_db()





            sensorgroup_obj = SensorgroupModel.find_by_id(sensorgroup_id)

            sensorgroup_obj.sensorgroup_initial_date = sensor_initila_date

            sensorgroup_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "Initial date가 등록 되었습니다."}, 200

    

        




class Sensorgroupmodal(Resource):
    parse = reqparse.RequestParser()
 

    parse.add_argument('sensorgroup_id', type=str)
    parse.add_argument('datarogger_id', type=str)
    parse.add_argument('sensor_gl1_max', type=str)
    parse.add_argument('sensor_gl1_min', type=str)
    parse.add_argument('sensor_gl2_max', type=str)
    parse.add_argument('sensor_gl2_min', type=str)
    parse.add_argument('sensor_gl3_max', type=str)
    parse.add_argument('sensor_gl3_min', type=str)
    parse.add_argument('sensor_id', type=str)
    parse.add_argument('sensor_detail_id', type=str)


    def get(self):
        print("edit sensorgruop gaugefactor")
        sensorgroup_gauge_factor = request.args.get('sensorgroup_gauge_factor')
        sensorgroup_id = request.args.get('sensorgroup_id')

        sensorgroup_obj = SensorgroupModel.find_by_id(sensorgroup_id)
        sensorgroup_obj.sensorgroup_gauge_factor = sensorgroup_gauge_factor

        try:
            sensorgroup_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200

    def post(self):
        print("JELLLO")
        params = Sensorgroupmodal.parse.parse_args()
       

        sensorgroup_id = params['sensorgroup_id']

        sensor_gl1_max = params['sensor_gl1_max']
        sensor_gl1_min = params['sensor_gl1_min']
        sensor_gl2_max = params['sensor_gl2_max']
        sensor_gl2_min = params['sensor_gl2_min']
        sensor_gl3_max = params['sensor_gl3_max']
        sensor_gl3_min = params['sensor_gl3_min']
      
        if sensor_gl1_max is not None and len(sensor_gl1_max) ==0: sensor_gl1_max = None
        else : sensor_gl1_min = "-"+sensor_gl1_max
        # if sensor_gl1_min and len(sensor_gl1_min) ==0: sensor_gl1_min = None
        if sensor_gl2_max is not None and len(sensor_gl2_max) ==0: sensor_gl2_max = None
        else : sensor_gl2_min = "-"+sensor_gl2_max
        # if sensor_gl2_min and len(sensor_gl2_min) ==0: sensor_gl2_min = None
        if sensor_gl3_max is not None and len(sensor_gl3_max) ==0: 
            sensor_gl3_max = None
            print("!!")
        else : sensor_gl3_min = "-"+sensor_gl3_max

        
    
        sensor_detail_obj = SensorgroupModel.find_by_id(sensorgroup_id)

        sensor_detail_obj.sensorgroup_gl1_max = sensor_gl1_max
        sensor_detail_obj.sensorgroup_gl1_min = sensor_gl1_min
        sensor_detail_obj.sensorgroup_gl2_max = sensor_gl2_max
        sensor_detail_obj.sensorgroup_gl2_min = sensor_gl2_min
        sensor_detail_obj.sensorgroup_gl3_max = sensor_gl3_max
        sensor_detail_obj.sensorgroup_gl3_min = sensor_gl3_min


       
        sensor_detail_obj.save_to_db()

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200