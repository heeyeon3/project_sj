import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from models.company import CompanyModel
from models.sensordetail import SensorDetailModel
from models.sensorgroup import SensorgroupModel
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import logging
import json
from models.project import ProjectModel
from models.place import PlaceModel

from datetime import datetime

class Place(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('project_id', type=str)
    parse.add_argument('place_id', type=str)
    parse.add_argument('place_name', type=str)
    parse.add_argument('place_lat', type=str)
    parse.add_argument('place_lng', type=str)
    parse.add_argument('place_index', type=str)
    parse.add_argument('use_yn', type=str)

    parse.add_argument('user_id', type=str)
 
    

    def get(self):

        project_id =              request.args.get('project_id')
    
        data = [dict(r) for r in PlaceModel.find_map_data_by_project_id(project_id)]
     
        print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        # params = sensor.parse.parse_args()
        # print("!!!!")
        # print(params)

        jsonData = request.get_json()

        print(jsonData)

        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()

        for i in range(len(jsonData)):
            place_id = jsonData[i]["place_id"]
            
            use_yn = jsonData[i]["use_yn"]

            if use_yn == 'N':
                print("in1")
                data = [dict(r) for r in SensorgroupModel.sensorgroup_mapping_place_id(place_id)]
                if len(data) != 0:
                    print("in")
                    return {'resultCode': '10', "resultString": "매핑 된 센서 그룹이 존재하여 삭제할 수 없습니다."}, 200



        try:
            for i in range(len(jsonData)):
                place_id = jsonData[i]["place_id"]
                place_name = jsonData[i]["place_name"]
                place_lat = jsonData[i]["place_lat"]
                place_lng = jsonData[i]["place_lng"]
                place_index = jsonData[i]["place_index"]
                use_yn = jsonData[i]["use_yn"]
                project_id = jsonData[i]["project_id"]

                if(len(jsonData[i]["place_id"]) == 0):
                    
                    print("없음")
                    # place_name = jsonData[i]["place_name"]
                    # place_lat = jsonData[i]["place_lat"]
                    # place_lng = jsonData[i]["place_lng"]
                    # place_index = jsonData[i]["place_index"]
                    # use_yn = jsonData[i]["use_yn"]
                    # project_id = jsonData[i]["project_id"]
                
                    place_obj = PlaceModel(place_name, place_lat, place_lng, place_index, use_yn, user_id, project_id, create_date, modify_date)
                    place_obj.save_to_db()

                else:
                    
                    place_obj = PlaceModel.find_by_id(place_id)
                    place_obj.place_name = place_name
                    place_obj.place_lat = place_lat
                    place_obj.place_lng = place_lng
                    place_obj.place_index = place_index
                    place_obj.use_yn = use_yn
                    place_obj.modify_date = modify_date

                    place_obj.save_to_db()




            # return {'resultCode': '0', "resultString": "SUCCESS"}, 200

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200
