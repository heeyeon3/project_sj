from datetime import datetime
import resource
from pymysql import NULL
from flask_jwt_extended import jwt_required
from flask_restful import Resource, reqparse, request
# from werkzeug.datastructures import FileStorage
import werkzeug

from models.datarogger import DataroggerModel
from models.rawdata import RawdataModel
from models.editdata import EditdataModel
from resource.project import ProjectModel, project
from resource.sensordetail import SensorDetailModel, Sensordetailmodal
from resource.sensor import SensorModel
from resource.alarm import AlarmModel
from resource.user import UserModel

from utils.jsonutil import AlchemyEncoder as jsonEncoder
from config.properties import *
from utils.fileutil import FileUtils
from flask_login import current_user
import json
import logging
import time
import pandas as pd
import mysql.connector

from math import pi, sin, cos, tan, log, e
import math

# 컨텐츠(상세조회/등록/수정/삭제)
class Datarogger(Resource):


    # def __init__(self, datarogger_name, datarogger_url, use_yn, user_id, project_id, create_date, modify_date):

    parse = reqparse.RequestParser()

    parse.add_argument('datarogger_name',   type=str)
    parse.add_argument('datarogger_url',    type=str)
    parse.add_argument('use_yn',            type=str)
    parse.add_argument('user_id',           type=str)
    parse.add_argument('project_id',        type=int)
    parse.add_argument('company_id',        type=int)

    parse.add_argument('file',          type=werkzeug.datastructures.FileStorage, location='files')

    def get(self, cont_seq):

        params = Datarogger.parse.parse_args()
        # area_seq = params['group']

        # contents_list = ContentsModel.get_contents_list()

        return {'resultCode': '0', "resultString": "SUCCESS"}, 200

    def post(self):

        params = Datarogger.parse.parse_args()

        datarogger_files = request.files['datarogger_files']
        datarogger_urls = ''
        datarogger_path = ''
        create_date = datetime.now()
        modify_date = datetime.now()

        print(params)
        
        user_id = params['user_id']
        company_id = params['company_id']
        # user_obj = UserModel.find_by_id(user_id)

        # company_id = user_obj.company_id
        if datarogger_files :
            
        # 업로드된 파일이 존재 하는 경우 conts 데이터 셋 만들기

            datarogger_path =         datarogger_file
            datarogger_urls =          datarogger_url
            print(datarogger_file)
            print(datarogger_urls)
            # 파일명 추출 (파일명에 띄어쓰기 있는경우 파일명이 중간에 잘림)
            datarogger_org_nm = str(datarogger_files.filename.replace(" ", "_"))           # 필드 생성 후 저장 해야함
            fname, ext = os.path.splitext(datarogger_org_nm)
            print(datarogger_org_nm)
            
            datarogger_file_name = fname + "_" +ext

            # URL 설정(코드 + 파일명)
            datarogger_path += str(company_id) + "/"
            datarogger_urls += str(company_id) + "/" + datarogger_file_name
            use_yn = "Y"
            datarogger_name = fname
                            
            datarogger_exist = DataroggerModel.find_by_name(datarogger_file_name, company_id)

            print(datarogger_urls)


            
            try:
                if not FileUtils.save_file(datarogger_files, datarogger_path, datarogger_file_name):
                    raise Exception('not save file %s' % datarogger_path + datarogger_file_name)

                if datarogger_exist :
                    datarogger_id = datarogger_exist.datarogger_id
                   
                    datarogger_obj = DataroggerModel.find_by_id(datarogger_id)
                    datarogger_obj.datarogger_request = 'request'
                    datarogger_obj.modify_date = modify_date

                    datarogger_obj.save_to_db()
                else :
                    datarogger_obj = DataroggerModel(datarogger_file_name, datarogger_urls, "request", use_yn, user_id, company_id, None, create_date, modify_date)
                    print(datarogger_obj)
                    # DB 저장
                    datarogger_obj.save_to_db()
                    # datarogger_id = DataroggerModel.find_by_name(datarogger_name).datarogger_id

                # print(datarogger_urls)

                

                # 센서 값 받아오기
                # file = pd.read_table(datarogger_urls, sep=',', encoding='UTF-8')
                # print("file", file)
                # rawdata_result = [dict(r) for r in RawdataModel.find_by_datarogger_id(str(datarogger_id))]
                # # last_Data = file.loc[len(file)-1]
                # print(rawdata_result)
                # for j in range(len(file)):
                #     data_raw = file.loc[j]

                    

                #     if rawdata_result :

                #         format = '%Y-%m-%d %H:%M:%S'
                #         datetime_data_raw = datetime.strptime(data_raw[0],format)
                #         rawdata_date = rawdata_result[0]["sensor_data_date"] 
                #         rawdata_date = datetime.strptime(rawdata_date,format)

                #         if rawdata_date < datetime_data_raw:
                #             for i in range(len(data_raw)):
                #                 sensor_data_date =  data_raw[0]
                #                 if(i > 2):
                #                     sensor_name = data_raw.index[i]
                #                     sensor_data = data_raw[i]
                #                     sensor_index = i-2
                                    
                #                     sensor = SensorModel.find_by_datarogger_id_sensorname(sensor_name, datarogger_id)
                #                     sensor_id = sensor.sensor_id
                #                     sensordetail = SensorDetailModel.find_by_sensor_id(sensor_id)

                #                     lastsensor = [dict(r) for r in EditdataModel.last_editdata(sensor_name, datarogger_id)]
                #                     last_sensordata = lastsensor[0]['sensor_data']
                #                     edit_yn = 'Y'

                #                     if sensordetail:
                #                         sensor_max = sensordetail.sensor_max
                #                         sensor_min = sensordetail.sensor_min
                #                         sensor_weight = sensordetail.sensor_weight
                #                         sensor_deviation = sensordetail.sensor_deviation
                #                         sensor_fx_check = sensordetail.sensor_fx_check
                #                         sensor_initial_data = sensordetail.sensor_initial_data
                #                         sensor_gauge_factor = sensordetail.sensor_gauge_factor
                #                         sensor_gl1_max = sensordetail.sensor_gl1_max
                #                         sensor_gl1_min = sensordetail.sensor_gl1_min
                #                         sensor_gl2_max = sensordetail.sensor_gl2_max
                #                         sensor_gl2_min = sensordetail.sensor_gl2_min
                #                         sensor_gl3_max = sensordetail.sensor_gl3_max
                #                         sensor_gl3_min = sensordetail.sensor_gl3_min

                #                         if sensor_initial_data is None or len(sensor_initial_data) == 0:
                #                             sensor_initial_data = '0'
                #                         if sensor_gauge_factor is None or len(sensor_gauge_factor) == 0:
                #                             sensor_gauge_factor = "0"

                #                         if sensordetail.sensor_st_over_ex == 'Y':
                #                             if (len(sensor_max) !=0 and float(sensor_max)>sensor_data) or (len(sensor_min) !=0 and float(sensor_min)<sensor_data):
                #                                 sensor_edit_data = last_sensordata

                #                         if sensordetail.sensor_st_over_wt == 'Y':
                #                             if (len(sensor_max) !=0 and float(sensor_max)>sensor_data):
                #                                 sensor_edit_data = sensor_data - sensor_data * float(sensor_weight)
                #                                 edit_yn = 'N'
                #                             elif (len(sensor_min) !=0 and float(sensor_min)<sensor_data):
                #                                 sensor_edit_data = sensor_data + sensor_data * float(sensor_weight)
                #                                 edit_yn = 'N'
                #                         if sensordetail.sensor_dev_over_ex == 'Y':
                #                             if (len(sensor_deviation) !=0 and float(sensor_deviation)<sensor_data):
                #                                 sensor_edit_data = last_sensordata
                #                                 edit_yn = 'N'
                #                             elif (len(sensor_deviation) !=0 and float(sensor_deviation)>sensor_data):
                #                                 sensor_edit_data = last_sensordata
                #                                 edit_yn = 'N'

                #                         if sensordetail.sensor_dev_over_wt == 'Y':
                #                             if (len(sensor_deviation) !=0 and float(sensor_deviation)<sensor_data):
                #                                 sensor_edit_data = sensor_data - sensor_data * float(sensor_weight)
                #                                 edit_yn = 'N'
                #                             elif (len(sensor_deviation) !=0 and float(sensor_deviation)>sensor_data):
                #                                 sensor_edit_data = sensor_data - sensor_data * float(sensor_weight)
                #                                 edit_yn = 'N'

                #                         if sensordetail.sensor_null_ex == 'Y':
                #                             if float(sensor_data) > 0.001:
                #                                 sensor_edit_data = sensor_data
                #                                 edit_yn = 'N'
                #                             else:
                #                                 sensor_edit_data = last_sensordata
                #                                 edit_yn = 'N'

                #                         if sensordetail.sensor_default_wt == 'Y':
                #                                 sensor_edit_data = sensor_data - sensor_data * float(sensor_weight)
                #                                 edit_yn = 'N'


                #                         if sensor_fx_check == '1':
                    
                #                             if sensordetail.sensor_fx1 and len(sensordetail.sensor_fx1) != 0 :
                    
                                            
                #                                 current_fx = sensordetail.sensor_fx
                #                                 current_fx = current_fx.replace('$sen', sensor_data)
                #                                 current_fx = current_fx.replace('$ini', sensor_initial_data)
                #                                 current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                #                                 sensor_fx_data = eval(current_fx)
                                                    
                                    
                #                         elif sensor_fx_check == '2':
                #                             if sensordetail.sensor_fx2 and len(sensordetail.sensor_fx2) != 0 :
                                            
                                               
                #                                 current_fx = sensordetail.sensor_fx2
                #                                 current_fx = current_fx.replace('$sen', sensor_data)
                #                                 current_fx = current_fx.replace('$ini', sensor_initial_data)
                #                                 current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                #                                 sensor_fx_data = eval(current_fx)


                #                         elif sensor_fx_check == '3':
                                    
                #                             if sensordetail.sensor_fx3 and len(sensordetail.sensor_fx3) != 0 :
                                        
                #                                 current_fx = sensordetail.sensor_fx3
                #                                 current_fx = current_fx.replace('$sen', sensor_data)
                #                                 current_fx = current_fx.replace('$ini', sensor_initial_data)
                #                                 current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                #                                 sensor_fx_data = eval(current_fx)

                #                         elif sensor_fx_check == '4':

                #                             if sensordetail.sensor_fx4 and len(sensordetail.sensor_fx4) != 0 :
                                            
                #                                 current_fx = sensordetail.sensor_fx4
                #                                 current_fx = current_fx.replace('$sen', sensor_data)
                #                                 current_fx = current_fx.replace('$ini', sensor_initial_data)
                #                                 current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                #                                 sensor_fx_data = eval(current_fx)

                #                         elif sensor_fx_check == '5':    

                #                             if sensordetail.sensor_fx5 and len(sensordetail.sensor_fx5) != 0 :
                                            
                #                                 current_fx = sensordetail.sensor_fx5
                #                                 current_fx = current_fx.replace('$sen', sensor_data)
                #                                 current_fx = current_fx.replace('$ini', sensor_initial_data)
                #                                 current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                #                                 sensor_fx_data = eval(current_fx)
                                        
                                        
                                                
                #                     try:
                #                         rawdata_obj = RawdataModel(sensor_data_date, sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date)
                #                         editdata_obj = EditdataModel(sensor_data_date, sensor_name, sensor_edit_data, sensor_index,edit_yn,None, datarogger_id, create_date, modify_date)
                                        
                #                         rawdata_obj.save_to_db()
                #                         editdata_obj.save_to_db()

                #                         datarogger_obj = DataroggerModel.find_by_id(datarogger_id)
                #                         datarogger_obj.datarogger_request = 'request'

                #                         datarogger_obj.svae_to_db()

                #                         if (sensor_gl1_min > sensor_fx_data and sensor_gl2_min < sensor_fx_data) or (sensor_gl1_max < sensor_fx_data and sensor_gl2_max >sensor_fx_data):
                #                             print("lv1")
                #                             editdata_obj = EditdataModel.find_by_editdata(sensor_name, datarogger_id, sensor_data_date)
                #                             editdata_id = editdata_obj.editdata_id
                #                             alarm_obj = AlarmModel("1", sensor_id, datarogger_id, editdata_id, sensor_data_date, 'Y', project_id, create_date, modify_date)
                #                             alarm_obj.save_to_db()
                #                         elif (sensor_gl2_min > sensor_fx_data and sensor_gl3_min < sensor_fx_data) or (sensor_gl2_max < sensor_fx_data and sensor_gl3_max >sensor_fx_data):
                #                             print("lv2")
                #                             editdata_obj = EditdataModel.find_by_editdata(sensor_name, datarogger_id, sensor_data_date)
                #                             editdata_id = editdata_obj.editdata_id
                #                             alarm_obj = AlarmModel("1", sensor_id, datarogger_id, editdata_id, sensor_data_date, 'Y', project_id, create_date, modify_date)
                #                             alarm_obj.save_to_db()
                #                         elif (sensor_gl3_min > sensor_fx_data and sensor_gl3_max < sensor_fx_data):
                #                             print("lv3")
                #                             editdata_obj = EditdataModel.find_by_editdata(sensor_name, datarogger_id, sensor_data_date)
                #                             editdata_id = editdata_obj.editdata_id
                #                             alarm_obj = AlarmModel("1", sensor_id, datarogger_id, editdata_id, sensor_data_date, 'Y', project_id, create_date, modify_date)
                #                             alarm_obj.save_to_db()
                                                

                #                     except Exception as e:

                #                         logging.fatal(e, exc_info=True)
                #                         return {'resultCode': '100', "resultString": "FAIL"}, 500

                #     else :
                #         for i in range(len(data_raw)):
                #                 sensor_data_date =  data_raw[0]
                #                 if(i > 2):
                #                     sensor_name = data_raw.index[i]
                #                     sensor_data = data_raw[i]
                #                     sensor_index = i-2

                #                     try:
                #                         rawdata_obj = RawdataModel(sensor_data_date, sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date)
                #                         editdata_obj = EditdataModel(sensor_data_date, sensor_name, sensor_data, sensor_index,'N',None, datarogger_id, create_date, modify_date)
                                        
                                        
                #                         rawdata_obj.save_to_db()
                #                         editdata_obj.save_to_db()

                #                         datarogger_obj = DataroggerModel.find_by_id(datarogger_id)
                #                         datarogger_obj.datarogger_request = 'request'

                #                         datarogger_obj.svae_to_db()

                #                     except Exception as e:

                #                         logging.fatal(e, exc_info=True)
                #                         return {'resultCode': '100', "resultString": "FAIL"}, 500

                

            except Exception as e:

                logging.fatal(e, exc_info=True)
                return {'resultCode': '100', "resultString": "DATAROGGER 업로드에 실패하였습니다."}, 500

        return {'resultCode': '0', "resultString": "DATAROGGER가 업로드 되었습니다."}, 200

class DataloggerList(Resource):


    parse = reqparse.RequestParser()
    parse.add_argument('project_id',        type=str)


    def get(self):
        project_id = request.args.get('project_id')

        data = [dict(r) for r in DataroggerModel.datalogger_project(project_id)]
        
        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200

    def post(self):

        params = DataloggerList.parse.parse_args()
        print(params)

        project_id = params['project_id']
        print("project_id", project_id)

        project_obj = ProjectModel.find_by_id(project_id)

        company_id = project_obj.company_id
        data = [dict(r) for r in DataroggerModel.datalogger_list(str(company_id))]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200


class DataloggerListProject(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('project_id',        type=int, action='append')

    def get(self):
        print("getge")

        project_id = request.args.get('project_id')
        data = [dict(r) for r in DataroggerModel.datalogger_list_project(project_id)]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200


