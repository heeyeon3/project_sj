import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from models.company import CompanyModel
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import logging
import json
from models.alarm import AlarmModel
from models.notimanager import NotimanagerModel
from config.properties import *

from datetime import datetime



class notimanager(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('notimanager_id', type=str)
    parse.add_argument('notimanager_name', type=str)
    parse.add_argument('notimanager_num', type=str)
    parse.add_argument('project_id', type=str)
 


    def get(self):

        project_id = request.args.get('project_id')
    
        data = [dict(r) for r in NotimanagerModel.find_by_project(project_id)]
     
        print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        params = notimanager.parse.parse_args()
   
        print(params)

        notimanager_name = params['notimanager_name']
        notimanager_num = params['notimanager_num']
        project_id = params['project_id']

        create_date = datetime.now()
        modify_date = datetime.now()

        try:
            notimanamer_obj = NotimanagerModel(notimanager_name, notimanager_num, 'N', 'N','N', 'N','Y',project_id,create_date, modify_date )
            notimanamer_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "success"}, 200


    def put(self):
        params = notimanager.parse.parse_args()
   
        print(params)

        notimanager_name = params['notimanager_name']
        notimanager_num = params['notimanager_num']
        project_id = params['project_id']
        notimanager_id = params['notimanager_id']

        create_date = datetime.now()
        modify_date = datetime.now()

        try:
            notimanamer_obj = NotimanagerModel.find_by_id(notimanager_id)
            notimanamer_obj.notimanager_name = notimanager_name
            notimanamer_obj.notimanager_num =notimanager_num
            notimanamer_obj.modify_date =modify_date

            notimanamer_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "success"}, 200



class notimanagerall(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('notimanager_id', type=str)
    parse.add_argument('notimanager_name', type=str)
    parse.add_argument('notimanager_num', type=str)
    parse.add_argument('project_id', type=str)
 


    def post(self):
        jsonData = request.get_json()

        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()
   
        
        try:

            for i in range(len(jsonData)):

                notimanager_id = jsonData[i]['notimanager_id']
                notimanager_kakao = jsonData[i]['notimanager_kakao']
                notimanager_lv1 = jsonData[i]['notimanager_lv1']
                notimanager_lv2 = jsonData[i]['notimanager_lv2']
                notimanager_lv3 = jsonData[i]['notimanager_lv3']
                use_yn = jsonData[i]['use_yn']

                print(notimanager_id, notimanager_kakao,notimanager_lv1, notimanager_lv2, notimanager_lv3)
                modify_date = datetime.now()

                notimanager_obj = NotimanagerModel.find_by_id(notimanager_id)
                notimanager_obj.notimanager_kakao = notimanager_kakao
                notimanager_obj.notimanager_lv1 = notimanager_lv1
                notimanager_obj.notimanager_lv2 = notimanager_lv2
                notimanager_obj.notimanager_lv3 = notimanager_lv3
                notimanager_obj.use_yn = use_yn


                notimanager_obj.save_to_db()
                

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "success"}, 200