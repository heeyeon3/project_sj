from curses import raw
from dataclasses import replace
from datetime import datetime
from re import L
import resource
from unittest import result
from urllib import response
# from pymysql import NULL
from flask_jwt_extended import jwt_required
from flask_restful import Resource, reqparse, request
# from werkzeug.datastructures import FileStorage
import werkzeug
from resource import sensorgroup


from utils.jsonutil import AlchemyEncoder as jsonEncoder
from config.properties import *
from utils.fileutil import FileUtils
from flask_login import current_user
import json
import logging
import time
import pandas as pd
import mysql.connector
import requests, json

import requests


class alarmpost():

    def alarmpostgo(self):

        mydb = mysql.connector.connect(
            host =          "218.38.232.231",
            user =          "sjgeotec",
            password =      "sjgeotecWkd!",
            database =      "SJGEOTEC",
            auth_plugin=    'mysql_native_password'
        )

        
        try:
            # file = pd.read_csv("/Users/heeyeon/Downloads/Data/LID1459.txt", sep=',', encoding='utf8', engine='c')
            # print(file)
            # print(file.columns)
            # print(file.columns)


            # print("upload!!")
            mycursor = mydb.cursor(buffered=True)


            sql = """select alarm_id, alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, alarm_post_date, sensor_id, datarogger_id, editdata_id, sensor_data_date, project_id from tbl_alarm
                        where alarm_post_request ='request' limit 1;"""

            mycursor.execute(sql)
                
            rowlist = mycursor.fetchall()

            for row in rowlist:
                print(row)

                

                alarm_id = str(row[0])
                alarm_detail = row[1]
                sensor_id = str(row[6])
                datarogger_id = str(row[7])
                sensor_data_date = str(row[9])
                project_id = str(row[10])

                # print(alarm_id, sensor_id, datarogger_id, sensor_data_date, project_id)

                sql = "update tbl_alarm set alarm_post_request = 'complete'  where alarm_id='"+alarm_id+"';"
                mycursor.execute(sql)
                mydb.commit()


                sql = "select sensor_noti from tbl_sensordetail where sensor_id = '"+sensor_id +"';"
                mycursor.execute(sql)
                sensordetail = mycursor.fetchone()
                # print("sensordetail", sensordetail)

                if sensordetail[0] == 'N':
                    print("sensor kakao No")
                    mycursor.close()
                    return


                sql = "select alarm_id, alarm_post_yn, alarm_post_date, alarm_detail from tbl_alarm where sensor_id = '"+sensor_id+"' and alarm_post_yn = 'Y' order by alarm_post_date desc limit 1"
                # sql = "select alarm_id, alarm_post_yn, alarm_post_date from tbl_alarm where project_id = '1' order by create_date desc  limit 1"
                mycursor.execute(sql)
                lastalarm = mycursor.fetchone()
           
                
                if lastalarm is not None :
                    last_alarm_detail = lastalarm[3]
                    lasttime = str(lastalarm[2])
                    last_time = datetime.strptime(lasttime,  '%Y-%m-%d %H:%M:%S')
                    current_time = datetime.now()

                    time_interval = str(current_time - last_time)
                    # print(time_interval)
                    time_interval_split = time_interval.split(":")
                    time_interval_split = time_interval_split[0].split(",")

                    # time_interval_split_1 = time_interval_split.split(",")
                    # time_interval_split_1 = time_interval_split_1.split(",")
                    # print("time_interval", time_interval,"time_interval_split",time_interval_split)
                    # print("INININ")
                    if len(time_interval_split) == 1 and int(time_interval_split[0]) < 1 and last_alarm_detail == alarm_detail:
                 
                        mycursor.close()
                        return
              
   

                # if len(lastalarm) !=0:
                #     print("INININ")
                #     if len(time_interval_split) == 1 and int(time_interval_split[0]) >= 3 and last_alarm_detail == alarm_detail:
                #         mycursor.close()
                #         return

             



                print("kakaotest")
                
                sql ="""select notimanager_name, notimanager_num, notimanager_kakao, notimanager_lv1, notimanager_lv2, notimanager_lv3, project_name from tbl_notimanager a
                        left join tbl_project b on a.project_id = b.project_id where a.use_yn = 'Y' and a.project_id = '"""+str(project_id)+"""'"""
                # sql += "order by a.create_date desc limit 1"
        
                mycursor.execute(sql)

                notimanagerlist = mycursor.fetchall()
                
                # sql = "select sensor_type, sensor_name, sensorgroup_type, a.sensorgroup_id, sensor_display_name from tbl_sensor a left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id where a.sensor_id = '"+str(sensor_id)+"'"
                # mycursor.execute(sql)
                # sensordetail = mycursor.fetchone()

                # sensor_type = sensordetail[0]
                # sensor_name = sensordetail[1]
                # sensorgroup_type = sensordetail[2]
                # sensor_display_name = sensordetail[3]
                # print(sensordetail)

                # print(root_url)
                i = 1
            
                # sensor_url = "http://172.168.0.10:5300/" + "bo-00?alarm_id="+alarm_id +"&project_id="+project_id+"&sensor_id="+sensor_id
                sensor_url = "http://georim.kr:5300/" + "bo-00?alarm_id="+alarm_id +"&project_id="+project_id+"&sensor_id="+sensor_id

                for notimanager in notimanagerlist:
                    notimanager_num = notimanager[1][1:]
                    notimanager_kakao = notimanager[2]
                    notimanager_lv1 = notimanager[3]
                    notimanager_lv2 = notimanager[4]
                    notimanager_lv3 = notimanager[5]
                    project_name = notimanager[6]

                    print(notimanager_num, notimanager_kakao, notimanager_lv1, notimanager_lv2, notimanager_lv3, project_name)


                    datas = {
                        "usercode" : "sungjin207",
                        "deptcode" : "C0-4SN-QA",
                        "yellowid_key" : "a5766953940f6337c9809ea9420fd402235d6e1e", 
                        "messages" : [{
                            "message_id":str(alarm_id), #alarm id 
                            "callphone" : "82-"+notimanager_num,
                            "text" : "[알람]\n\n"+project_name+"\n\n관리기준치 Lv."+alarm_detail+" 초과 알람이 발생했습니다.\n자세한 내용은 아래 url을 참고해주시기 바랍니다.\n\n",
                            "template_code" : "geodata_002",
                            "buttons" :
                                [{
                                "button_type" : "WL",
                                "button_name" : "알람 확인", "button_url" : sensor_url,
                                "button_url2": sensor_url
                                }]
                        }]
                    }
                    print("datas",datas)
                    url = "https://rest.surem.com/biz/at/v2/json"
                    header = {'Content-Type':'application/json'}
                    # response = requests.post(url, json=datas, headers=header)
                    # print(response)
                    print(i)
                    i +=1
                    str_response = ""
                    if notimanager_kakao == 'Y':
                        if alarm_detail == "1" and notimanager_lv1 == 'Y':
                            print("lv1 초과")
                            response = requests.post(url, json=datas, headers=header)
                        
                            str_response = str(response)
                            print("1",response)

                        elif alarm_detail == "2" and notimanager_lv2 == 'Y':
                            response = requests.post(url, json=datas, headers=header)
                            str_response = str(response)
                            
                            print("lv2 초과")
                            print("2",response)
                        elif alarm_detail == "3" and notimanager_lv3 == 'Y':
                            response = requests.post(url, json=datas, headers=header)
                            str_response = str(response)
                            print("lv3 초과")
                            print("3",response)
                        if str_response == "<Response [200]>":

                            sql = "update tbl_alarm set alarm_post_yn = 'Y' , alarm_post_date = now(), modify_date = now() where alarm_id = '"+alarm_id+"'"
                            mycursor.execute(sql)
                            mydb.commit()


                            


                    

                    





        except Exception as e:
            print(e)
            mydb = mysql.connector.connect(
                host =          "218.38.232.231",
                user =          "sjgeotec",
                password =      "sjgeotecWkd!",
                database =      "SJGEOTEC",
                auth_plugin=    'mysql_native_password'
            )
            # DB connection retry
            mycursor = mydb.cursor()

            # mycursor.execute(sql)
            mydb.commit()

        mycursor.close()
        return