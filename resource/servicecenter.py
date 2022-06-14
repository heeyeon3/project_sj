import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from utils.jsonutil import AlchemyEncoder as jsonEncoder
from utils.fileutil import FileUtils
import logging
import json
from models.company import CompanyModel
from models.user import UserModel
from models.servicecenter import ServicecenterModel
from config.properties import *
from datetime import datetime
import time
from flask import send_from_directory
import requests # excel backup
import os
class servicecenter(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('servicecenter_name', type=str)
    parse.add_argument('servicecenter_inquiry', type=str)
    parse.add_argument('servicecenter_file', type=str)
    parse.add_argument('date_time_end', type=str)
    parse.add_argument('project_cost', type=str)
    parse.add_argument('project_memo', type=str)
    parse.add_argument('project_status', type=str)

    parse.add_argument('company_id', type=str)
    parse.add_argument('project_id', type=str)

    def get(self):

        servicecenter_id =              request.args.get('servicecenter_id')
     
        servicecenter_obj = [dict(r) for r in ServicecenterModel.find_by_servicecenter_id(servicecenter_id)]
       
        return {'resultCode': '0', "resultString": "SUCCESS", "data": servicecenter_obj}, 200
       


    def post(self):
        print("들어옴!!")
        params = servicecenter.parse.parse_args()
       

        project_id =          params['project_id']        
        servicecenter_name =          params['servicecenter_name']        
        servicecenter_inquiry =          params['servicecenter_inquiry']        
        servicecenter_file =       request.files['servicecenter_file']  
    
        user_id = current_user.user_id

        create_date = datetime.now()
        modify_date = datetime.now()


        if servicecenter_file:
            
            # DB 저장 필드
            # 파일명 추출 (파일명에 띄어쓰기 있는경우 파일명이 중간에 잘림)
            cont_org_nm = str(servicecenter_file.filename.replace(" ", "_"))           # 필드 생성 후 저장 해야함
            fname, ext = os.path.splitext(cont_org_nm)
     
            file_name = fname + "_"  + str(int(time.time())) + ext
   
            # 파일 업로드 디렉토리 세팅
            cont_path = common_file + str(project_id) 
            

            if not FileUtils.save_file(servicecenter_file, cont_path, file_name):
                raise Exception('not save image %s' % cont_path + file_name)


            

            

            img_url = root_url + 'common/' + str(project_id) + '/' + file_name
            # filename = root_url + 'common/' + str(project_id) + '/' + file_name
        

            dls = img_url
            resp = requests.get(dls)
            output = open(cont_path+'/'+file_name, 'rb')
         
            send_from_directory(cont_path + '/' , file_name)
            filename = img_url

        else:
            filename = None

        try:
            servicecenter_obj = ServicecenterModel(servicecenter_name, '0', servicecenter_inquiry, filename,'Y', user_id, project_id, create_date, modify_date, None, None, None)
            servicecenter_obj.save_to_db()
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200 


class servicesenterlist(Resource):
    
    parse = reqparse.RequestParser()

    parse.add_argument('servicecenter_name', type=str)
    parse.add_argument('servicecenter_inquiry', type=str)
    parse.add_argument('servicecenter_file', type=str)
    
    parse.add_argument('project_id', type=str)

    def get(self):

        project_id =              request.args.get('project_id')
  
        servicecenter_obj = [dict(r) for r in ServicecenterModel.servicecenter_list_project(project_id)]
       
   

        return {'resultCode': '0', "resultString": "SUCCESS", "data": servicecenter_obj}, 200


    def post(self):
    
        params = servicecenter.parse.parse_args()
     

        servicecenter_obj = [dict(r) for r in ServicecenterModel.servicecenter_list()]

     

        return {'resultCode': '0', "resultString": "SUCCESS", "data": servicecenter_obj}, 200




class servicecenteranswer(Resource):
    
    parse = reqparse.RequestParser()

    parse.add_argument('servicecenter_id', type=str)
    parse.add_argument('servicecenter_answer', type=str)
    parse.add_argument('servicecenter_file', type=str)
    
    parse.add_argument('project_id', type=str)

    def get(self):

        servicecenter_id =              request.args.get('servicecenter_id')
        # servicecenter_obj = [dict(r) for r in ServicecenterModel.find_by_servicecenter_id(servicecenter_id)]
       
        # print(servicecenter_obj)

        try:
            servicecenter_obj = ServicecenterModel.find_by_id(servicecenter_id)
            servicecenter_obj.servicecenter_answer_state = 'Y'
            servicecenter_obj.save_to_db()

            data = [dict(r) for r in ServicecenterModel.find_by_servicecenter_id(servicecenter_id)]
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS", "data": data}, 200


    def post(self):
   
        params = servicecenteranswer.parse.parse_args()

        servicecenter_answer = params['servicecenter_answer']
        servicecenter_id = params['servicecenter_id']

 
        servicecenter_answer_date = datetime.now()
        try:
            servicecenter_obj = ServicecenterModel.find_by_id(servicecenter_id)
            servicecenter_obj.servicecenter_answer = servicecenter_answer
            servicecenter_obj.servicecenter_answer_date = servicecenter_answer_date
            servicecenter_obj.servicecenter_status = '1'


            servicecenter_obj.save_to_db()

            
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200



class servicecentercount(Resource):
    
    parse = reqparse.RequestParser()

    parse.add_argument('servicecenter_name', type=str)
    parse.add_argument('servicecenter_inquiry', type=str)
    parse.add_argument('servicecenter_file', type=str)
    
    parse.add_argument('project_id', type=str)

    def get(self):

        user_id = current_user.user_id
        user_gr = UserModel.find_by_id(user_id).user_grade

        if str(user_gr) != "0101":
            return {'resultCode': '10', "resultString": "SUCCESS"}, 200

        servicecenter_id =              request.args.get('servicecenter_id')
        # print(servicecenter_id)
        servicecenter_obj = [dict(r) for r in ServicecenterModel.servicesenter_count()]
       
        # print(servicecenter_obj)
       

        return {'resultCode': '0', "resultString": "SUCCESS", "data": servicecenter_obj}, 200
       


    



