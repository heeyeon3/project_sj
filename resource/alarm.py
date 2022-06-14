import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from models.company import CompanyModel
from models.sensor import SensorModel
from models.sensordetail import SensorDetailModel
from resource.project import projectcostexceldown
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import logging
import json
from models.alarm import AlarmModel
from config.properties import *

from datetime import datetime



class alarm(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('alarm_id', type=str)
    # parse.add_argument('alarm_title', type=str)
    # parse.add_argument('alarm_contents', type=str)



    def get(self):

        # alarm_id =              request.args.get('alarm_id')
    
        data = [dict(r) for r in AlarmModel.find_by_all()]
     
        print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        params = alarm.parse.parse_args()
        print("!!!!")
        print(params)

        alarm_id = params['alarm_id']

        rootsplit = root_url.split('/')
        rootsplit = "/".join(rootsplit[0:3])
        print(rootsplit)
        

        try:
            data = [dict(r) for r in AlarmModel.find_by_alarm_info(alarm_id)]
            sensor_id = str(data[0]['sensor_id'])
            sensor_type = data[0]['sensor_type']
            sensorgroup_type = data[0]['sensorgroup_type']
            project_id = data[0]['project_id']
            print(sensor_id)
            rootsplit = root_url.split('/')
            rootsplit = "/".join(rootsplit[0:3])

            sensordetail = [dict(r) for r in SensorModel.sensor_id_info(sensor_id)]
            print(sensordetail)
            sensorgroup_type = sensordetail[0]['sensorgroup_type']
            sensor_display_name = sensordetail[0]['sensor_display_name']
            sensorgroup_id = sensordetail[0]['sensorgroup_id']

        
            if sensorgroup_type == "0203":

                param = (sensor_display_name, str(sensorgroup_id), str(sensor_id) )

                anorther_sensor = [dict(r) for r in SensorDetailModel.find_by_scatter_another_sensor(param)]
                another_sensor_id = str(anorther_sensor[0]['sensor_id'])

                another_data = [dict(r) for r in SensorDetailModel.sensordetail_info_sensor_id(another_sensor_id)]

                if anorther_sensor and len(anorther_sensor) > 0 :
                    another_sensor_id = str(anorther_sensor[0]['sensor_id'])
            
                    another_data = [dict(r) for r in SensorDetailModel.sensordetail_info_sensor_id(another_sensor_id)]
                
                    if another_data and sensordetail[0]['sensor_type'] == 'x':
                        
                    
                        sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(sensordetail[0]['sensor_id'])+"&c2Vy="+str(another_data[0]['sensor_id'])+"&cHJ="+str(project_id)+"&Hlw=0203"
                    elif another_data and sensordetail[0]['sensor_type'] == 'y':
                        
            
                        sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(another_data[0]['sensor_id'])+"&c2Vy="+str(sensordetail[0]['sensor_id'])+"&cHJ="+str(project_id)+"&Hlw=0203"
                else :
                    sensor_url  = ""
            else:

                sensor_url = str(rootsplit) +"/ws-02-2-1?c2V="+str(sensor_id)+"&cHJ="+str(project_id)+"&Hlw="+str(sensorgroup_type)
            data[0]['sensor_url'] = sensor_url

            

      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "success", "data": data }, 200



class alarmbo(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('alarm_id', type=str)
    parse.add_argument('sensor_id', type=str)
    parse.add_argument('project_id', type=str)
    # parse.add_argument('alarm_title', type=str)
    # parse.add_argument('alarm_contents', type=str)

    def get(self):
        project_id =              request.args.get('project_id')
    
        data = [dict(r) for r in AlarmModel.find_by_project_id(project_id)]

        place = [dict(r) for r in AlarmModel.count_place(project_id)]
        sensorgroup = [dict(r) for r in AlarmModel.count_sensorgroup(project_id)]
        sensor = [dict(r) for r in AlarmModel.count_sensor(project_id)]

        place_lv = 0
        sensorgroup_lv = 0
        sensor_lv = 0

        for j in range(len(place)):
            place[j]['alarm_detail'] = '0'
        for j in range(len(sensorgroup)):
            sensorgroup[j]['alarm_detail'] = '0'
        for j in range(len(sensor)):
            sensor[j]['alarm_detail'] = '0'

        for i in range(len(data)):

            for j in range(len(place)):

                if place[j]['place_id'] == data[i]['place_id']:
                    if int(data[i]['alarm_detail']) > int(place[j]['alarm_detail']):
                        place[j]['alarm_detail'] = data[i]['alarm_detail']
                        
            for j in range(len(sensorgroup)):
                if sensorgroup[j]['sensorgroup_id'] == data[i]['sensorgroup_id']:
                    if int(data[i]['alarm_detail']) > int(sensorgroup[j]['alarm_detail']):
                        sensorgroup[j]['alarm_detail'] = data[i]['alarm_detail']

            for j in range(len(sensor)):
                
                if sensor[j]['sensor_id'] == data[i]['sensor_id']:
        
                    if int(data[i]['alarm_detail']) > int(sensor[j]['alarm_detail']):
                        sensor[j]['alarm_detail'] = data[i]['alarm_detail']



        # place = [dict(r) for r in AlarmModel.count_place(project_id)]
        # sensorgroup = [dict(r) for r in AlarmModel.count_sensorgroup(project_id)]
        # sensor = [dict(r) for r in AlarmModel.count_sensor(project_id)]
     
      

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data,"place":place,"sensorgroup":sensorgroup,"sensor":sensor}, 200


    def post(self):

        params = alarmbo.parse.parse_args()
   
  

        alarm_id = params["alarm_id"]
        sensor_id = params["sensor_id"]
        project_id = params["project_id"]
    
        sensordetail = [dict(r) for r in SensorModel.sensor_id_info(sensor_id)]

        sensorgroup_type = sensordetail[0]['sensorgroup_type']
        sensor_display_name = sensordetail[0]['sensor_display_name']
        sensorgroup_id = sensordetail[0]['sensorgroup_id']

        
        rootsplit = root_url.split('/')
        rootsplit = "/".join(rootsplit[0:3])
    
        if sensorgroup_type == "0203":

            param = (sensor_display_name, sensorgroup_id, sensor_id )

            anorther_sensor = [dict(r) for r in SensorDetailModel.find_by_scatter_another_sensor(param)]
            another_sensor_id = str(anorther_sensor[0]['sensor_id'])

            another_data = [dict(r) for r in SensorDetailModel.sensordetail_info_sensor_id(another_sensor_id)]

            if anorther_sensor and len(anorther_sensor) > 0 :
                another_sensor_id = str(anorther_sensor[0]['sensor_id'])
        
                another_data = [dict(r) for r in SensorDetailModel.sensordetail_info_sensor_id(another_sensor_id)]
            
                if another_data and sensordetail[0]['sensor_type'] == 'x':
                    
                
                    sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(sensordetail[0]['sensor_id'])+"&c2Vy="+str(another_data[0]['sensor_id'])+"&cHJ="+project_id+"&Hlw=0203"
                elif another_data and sensordetail[0]['sensor_type'] == 'y':
                    
         
                    sensor_url = str(rootsplit) +"/ws-02-2-6?c2Vx="+str(another_data[0]['sensor_id'])+"&c2Vy="+str(sensordetail[0]['sensor_id'])+"&cHJ="+project_id+"&Hlw=0203"
            else :
                sensor_url  = ""
        else:

            sensor_url = str(rootsplit) +"/ws-02-2-1?c2V="+sensor_id+"&cHJ="+project_id+"&Hlw="+sensorgroup_type


        sensordetail[0]['sensor_url'] = sensor_url
        alarm_obj = [dict(r) for r in AlarmModel.find_by_id_sql(alarm_id)]  
        sensordetail[0]['alarm_date'] = alarm_obj[0]['sensor_data_date']
       
      
        return {'resultCode': '0', "resultString": "SUCCESS", "data":sensordetail}, 200



    def put(self):

        params = alarmbo.parse.parse_args()
   
  

        alarm_id = params["alarm_id"]
        sensor_id = params["sensor_id"]
        project_id = params["project_id"]
    
        alarmlist = [dict(r) for r in AlarmModel.alarm_list_project_id(project_id)]

        try:
            for i in range(len(alarmlist)):
                print("test", i)
                alamr_id = alarmlist[i]['alarm_id']

                alarm_obj = AlarmModel.find_by_id(str(alamr_id))
                alarm_obj.use_yn = 'N'

                alarm_obj.save_to_db()
        
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500 
        
      
        return {'resultCode': '0', "resultString": "SUCCESS", "data":alarmlist}, 200
