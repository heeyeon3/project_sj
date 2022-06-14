import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from utils.jsonutil import AlchemyEncoder as jsonEncoder
from utils.fileutil import FileUtils
from config.properties import *
import logging
import json
import os
import time
from models.company import CompanyModel
from models.user import UserModel
from models.floorplan import FloorplanModel
from models.place import PlaceModel
from models.sensordetail import SensorDetailModel

from datetime import datetime


class Floorplan(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('floorplan_id',   type=str)
    parse.add_argument('floorplan_x',    type=str)
    parse.add_argument('floorplan_y',   type=str)
    parse.add_argument('senser_id',    type=str)
    parse.add_argument('sensorgroup_id',    type=str)
    parse.add_argument('use_yn',   type=str)
    parse.add_argument('user_id',    type=str)
    parse.add_argument('project_id',   type=str)
    # parse.add_argument('id',   type=str)

    def get(self):
        project_id = request.args.get('project_id')

        resultString = [dict(r) for r in FloorplanModel.find_floorplan_list(project_id)]

        print(resultString)

        rootsplit = root_url.split('/')
        rootsplit = "/".join(rootsplit[0:3])
        # rootsplit = ""

        for i in range(len(resultString)):
            project_id = str(resultString[i]['project_id'])
            sensor_id = str(resultString[i]['sensor_id'])
            print(sensor_id)
            sensorgroup_type = str(resultString[i]['sensorgroup_type'])
            sensorgroup_id = str(resultString[i]['sensorgroup_id'])


            if resultString[i]['sensorgroup_type'] != '0203':

                if sensor_id == 'All' :
                    if sensorgroup_type == '0201' :
                        # 가로형 All
                        # /ws-02-1-1?project_id=13&sensorgroup_id=71&sensorgroup_type=0201
                        sensor_url = str(rootsplit) + '/ws-02-1-1?cHJ='+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type
                    elif sensorgroup_type == '0202' :
                        # 세로형 All
                        # /ws-02-1-2?project_id=13&sensorgroup_id=72&sensorgroup_type=0202
                        sensor_url = str(rootsplit) + '/ws-02-1-2?cHJ='+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type
                    elif sensorgroup_type == '0204' :
                        # 로드셀 All
                        # /ws-02-1-13?project_id=13&sensorgroup_id=74&sensorgroup_type=0204
                        sensor_url = str(rootsplit) + '/ws-02-1-13?cHJ='+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type
                    elif sensorgroup_type == '0205' :
                        # 독립형 All
                        # /ws-02-1-8?project_id=13&sensorgroup_id=75&sensorgroup_type=0205
                        sensor_url = str(rootsplit) + '/ws-02-1-8?cHJ='+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type
                else :
                    sensor_url = str(rootsplit) + '/ws-02-2-1?cHJ='+project_id+"&c2V="+sensor_id+"&Hlw="+sensorgroup_type

            else:
                if sensor_id == 'All' :
                    sensor_url = str(rootsplit) + '/ws-02-1-7?cHJ='+project_id+"&aWQ="+sensorgroup_id+"&Hlw="+sensorgroup_type
                else :
                    print(project_id , sensor_id, sensorgroup_type)
                    sensorgroup_id = resultString[i]['sensorgroup_id']
                    sensor_display_name = resultString[i]['sensor_display_name']
                    param = (sensor_display_name, str(sensorgroup_id), sensor_id)
                    
                    anorther_sensor = [dict(r) for r in SensorDetailModel.find_by_scatter_another_sensor(param)]
                    
                    if anorther_sensor and len(anorther_sensor) > 0 :
                        another_sensor_id = str(anorther_sensor[0]['sensor_id'])
                
                        another_data = [dict(r) for r in SensorDetailModel.sensordetail_info_sensor_id(another_sensor_id)]
                    
                        if another_data and resultString[i]['sensor_type'] == 'x':
                            
                        
                            sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(resultString[i]['sensor_id'])+"&c2Vy="+str(another_data[0]['sensor_id'])+"&cHJ="+str(resultString[i]['project_id'])+"&Hlw=0203"
                        elif another_data and resultString[i]['sensor_type'] == 'y':
                            
                            print("4")
                            sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(another_data[0]['sensor_id'])+"&c2Vy="+str(resultString[i]['sensor_id'])+"&cHJ="+str(resultString[i]['project_id'])+"&Hlw=0203"
                    else :
                        sensor_url  = ""
            
            
            resultString[i]['sensor_url'] = sensor_url


        return {"resultCode" : '0', "data" : resultString}




    def post(self):

        # params = Floorplan.parse.parse_args()

        jsonData = request.get_json()
        print(jsonData)
        
        user_id = current_user.user_id
        create_date =datetime.now()
        modify_date =datetime.now()


        try:

            for i in range(len(jsonData)):
                sensorgroup_id = jsonData[i]['sensorgroup_id']
                sensor_id = jsonData[i]['sensor_id']
                project_id = jsonData[i]['project_id']
                floorplan_x = jsonData[i]['floorplan_x']
                floorplan_y = jsonData[i]['floorplan_y']
                use_yn = jsonData[i]['use_yn']
                floorplan_id = jsonData[i]['floorplan_id']

                if len(floorplan_id) == 0 and use_yn == 'Y' :
                    floorplan_obj = FloorplanModel(floorplan_x, floorplan_y, sensorgroup_id, sensor_id, use_yn, user_id, project_id, create_date, modify_date)
                    floorplan_obj.save_to_db()

                elif len(floorplan_id) != 0:
                    floorplan_obj = FloorplanModel.find_by_id(floorplan_id)
                    
                    floorplan_obj.use_yn = use_yn
                    floorplan_obj.save_to_db()
        
                

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "고객사가 등록 되었습니다."}, 200



    def put(self):
        company_id =              request.args.get('company_id')

        print(company_id)
        
        params = Floorplan.parse.parse_args()
        print(params)
        
        company_set_id =   params['company_set_id']
        company_name =     params['company_name']                             
        company_ceo =      params['company_ceo']
        company_regnum =   params['company_regnum']
        company_worktype = params['company_worktype']
        company_workcate = params['company_workcate']
        company_email =    params['company_email']      
        company_number =   params['company_number']            
        company_faxnum =   params['company_faxnum']          
        company_address =  params['company_address']            
        company_picname =  params['company_picname']              
        company_picnum =   params['company_picnum']
        company_picemail = params['company_picemail']
        # company_img =      params['company_img']

        company_img = request.files['company_img']
        modify_date = datetime.now()

        print(company_img)


        if company_img:

            # DB 저장 필드
            # 파일명 추출 (파일명에 띄어쓰기 있는경우 파일명이 중간에 잘림)
            cont_org_nm = str(company_img.filename.replace(" ", "_"))           # 필드 생성 후 저장 해야함
            fname, ext = os.path.splitext(cont_org_nm)
            company_img_name = fname + "_"  + str(int(time.time())) + ext
            
           
            # 파일 업로드 디렉토리 세팅
            cont_path = shot_file + company_id + '/company_img'
            print(cont_path)
            try:

                if not FileUtils.save_file(company_img, cont_path, company_img_name):
                    raise Exception('not save image %s' % cont_path + company_img_name)


            except Exception as e:

                logging.fatal(e, exc_info=True)
                print("Screenshot FAIL")

                return {'resultCode': '100', "resultString": "Screen Shot 파일 업로드에 실패하였습니다."}, 500
        else:
            print("파일이 존재하지 않습니다.")

            return {'resultCode': '0', "resultString": "Screen Shot 파일이 존재하지 않습니다"}, 200

        img_url = root_url + 'shot/' + company_id + '/company_img'+ '/' + company_img_name

        print(img_url)
   

        try:
            company_obj = CompanyModel.find_by_id(company_id)

            print(company_set_id)
            company_obj.company_set_id  = company_set_id
            company_obj.company_name  = company_name
            company_obj.company_ceo  = company_ceo
            company_obj.company_regnum  = company_regnum
            company_obj.company_worktype  = company_worktype
            company_obj.company_workcate  = company_workcate
            company_obj.company_email  = company_email
            company_obj.company_number  = company_number
            company_obj.company_faxnum  = company_faxnum
            company_obj.company_address  = company_address
            company_obj.company_picname  = company_picname
            company_obj.company_picnum  = company_picnum
            company_obj.company_picemail  = company_picemail
            company_obj.company_img  = img_url
         
            company_obj.modify_date  = modify_date
            company_obj.save_to_db()

        except Exception as e:

                logging.fatal(e, exc_info=True)
                return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "프로젝트가 등록 되었습니다."}, 200

class companylist(Resource):

    parse = reqparse.RequestParser()

    def post(self):

        params = companylist.parse.parse_args()

        result_string = [dict(r) for r in CompanyModel.company_list()]

        return {'resultCode': '0', "resultString": "Succes", "data": result_string}, 200