from curses import raw
from dataclasses import replace
from datetime import datetime
import resource
from unittest import result
# from pymysql import NULL
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
import requests, json

from math import pi, sin, cos, tan, log, e
import math
from urllib.request import urlopen  
import urllib.request
# from bs4 import BeautifulSoup


class dataroggerUpload():

    def dataroggerupload(self):

        mydb = mysql.connector.connect(
            host =          "218.38.232.231",
            user =          "sjgeotec",
            password =      "sjgeotecWkd!",
            database =      "SJGEOTEC",
            auth_plugin=    'mysql_native_password'
        )
        try:
            print("upload!!")
            mycursor = mydb.cursor(buffered=True)

            sql = """select datarogger_id, datarogger_name, datarogger_url, datarogger_request from tbl_datarogger where datarogger_request = 'request' limit 1"""

            mycursor.execute(sql)
                
            rowlist = mycursor.fetchall()

            for row in rowlist:  
                
         
             
                datarogger_id = str(row[0])
                datarogger_name = row[1]
                datarogger_urls = row[2]
                
                datarogger_url_split = datarogger_urls.split("/")
         
                datarogger_urls = datarogger_file + datarogger_url_split[6] + "/" + datarogger_url_split[7]

                datarogger_name_split = datarogger_name.split('.')
                datarogger_name_split_1 = datarogger_name_split[len(datarogger_name_split)-1]

              
                sql = "update tbl_datarogger set datarogger_request = 'complete',  modify_date = now() where datarogger_id='"+datarogger_id+"';"
                mycursor.execute(sql)
                mydb.commit()

                if datarogger_name_split_1 == 'txt':
                    
                    print("txt")
                    file = pd.read_csv(datarogger_urls, sep=',', encoding='utf8')
                else:
                    print("dat")
                    file = pd.read_csv(datarogger_urls, sep=',', encoding='utf8', skiprows=[0])
                    file = file.drop([file.index[0], file.index[1]])
                    file = file.reset_index(drop=True)

                print(file)

                # datarogger_id ='26'
                sql = """select date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date,datarogger_id, sensor_name from tbl_rawdata where datarogger_id='""" +datarogger_id+"' order by sensor_data_date desc limit 1;"
                # sql += " order by sensor_data_date desc limit 1"

                

                mycursor.execute(sql)
                
                last_sensor_data = mycursor.fetchone() 
          

                create_date = str(datetime.now())
                print(type(create_date))
                modify_date = str(datetime.now())



                # sensorgroup_type = 'None'
                sensorgroup_gl1_max_0201 = 'None'
                sensorgroup_gl1_min_0201 = 'None'
                sensorgroup_gl2_max_0201 = 'None'
                sensorgroup_gl2_min_0201 = 'None'
                sensorgroup_gl3_max_0201 = 'None'
                sensorgroup_gl3_min_0201 = 'None'

                for idx in range(len(file)):
                    print("idx",idx)
                    data_raw = file.loc[idx]
                    print("data_raw", data_raw)
                    vertical = []
                    if last_sensor_data:
                        format = '%Y-%m-%d %H:%M:%S'
                        datetime_data_raw = datetime.strptime(data_raw[0],format)
                        last_date = last_sensor_data[0]
                        last_date = datetime.strptime(last_date,format)
                            
                        if last_date <= datetime_data_raw:
                            print(last_date, datetime_data_raw)
                            for i in range(len(data_raw)):
                                sensor_data_date =  data_raw[0]

                                if i < 3 and i != 0:
                                    sensor_name = data_raw.index[i]
                                    sensor_data = str(data_raw[i])
                                    sensor_edit_data = str(data_raw[i])
                                    sensor_index = str(i)

                                    sql = "select * from tbl_rawdata where sensor_data_date ='"+sensor_data_date+"' and datarogger_id='"+datarogger_id+"' and sensor_name='"+sensor_name+"';"

                                    mycursor.execute(sql)
                                    rawdata = mycursor.fetchone() 
                                   
                                    if rawdata is None:
                                        print("rawdata is None")
                                        sql = """insert into tbl_rawdata (sensor_data_date, sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_data+"', '"+ sensor_index+"', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                        mycursor.execute(sql)
                                        mydb.commit()

                                    
                                    sql = "select * from tbl_editdata where sensor_data_date ='"+sensor_data_date+"' and datarogger_id='"+datarogger_id+"' and sensor_name='"+sensor_name+"';"

                                    mycursor.execute(sql)
                                    editdata = mycursor.fetchone() 
                                    
                                    if editdata is None:
                                        print("editdata is None")
                                        sql = """insert into tbl_editdata (sensor_data_date, sensor_name, sensor_data, sensor_index, edit_yn, use_yn, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_edit_data+"', '"+ sensor_index+"', 'N', 'Y', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                        mycursor.execute(sql)
                                        mydb.commit()

                                elif(i > 2):
                                    sensor_name = data_raw.index[i]
                                    sensor_data = str(data_raw[i])
                                    sensor_edit_data = str(data_raw[i])
                                    sensor_index = str(i-2)
                                    current_sensor_null = 'N'

                                    sql = """select a.sensor_id, a.sensor_name, a.datarogger_id, b.sensor_fx_check, b.sensor_fx1, b.sensor_fx2, b.sensor_fx3, b.sensor_fx4, 
                                            b.sensor_fx5, b.sensor_gl1_min,b.sensor_gl1_max, b.sensor_gl2_min,b.sensor_gl2_max, b.sensor_gl3_min,b.sensor_gl3_max, b.sensor_max, b.sensor_min, b.sensor_weight, b.sensor_deviation, b.sensor_st_over_ex, b.sensor_st_over_wt,
                                            b.sensor_dev_over_ex, b.sensor_dev_over_wt, b.sensor_null_ex, b.sensor_default_wt, b.sensor_initial_data,b.sensor_gauge_factor, c.project_id, a.sensorgroup_id  from tbl_sensor a
                                            left join tbl_sensordetail b on a.sensor_id = b.sensor_id
                                            left join tbl_datarogger c on a.datarogger_id = c.datarogger_id
                                            where a.datarogger_id ='"""+datarogger_id+"' and a.sensor_name= '"+sensor_name+"'"

                                    mycursor.execute(sql)
                                    sensordetail = mycursor.fetchone() 
                                    print("sensordetail", sensordetail)
                                 
                                    sensor_fx_check = sensordetail[3]
                                  

                                    if sensor_fx_check == '1': sensor_fx = sensordetail[4]
                                    elif sensor_fx_check == '2': sensor_fx = sensordetail[5]
                                    elif sensor_fx_check == '3': sensor_fx = sensordetail[6]
                                    elif sensor_fx_check == '4': sensor_fx = sensordetail[7]
                                    elif sensor_fx_check == '5': sensor_fx = sensordetail[8]
                                    else: sensor_fx = None

                                    # ?????? ????????? ??????
                                    sensor_gl1_min = sensordetail[9]
                                    sensor_gl1_max = sensordetail[10]
                                    sensor_gl2_min = sensordetail[11]
                                    sensor_gl2_max = sensordetail[12]
                                    sensor_gl3_min = sensordetail[13]
                                    sensor_gl3_max = sensordetail[14]

                                    sensor_max = sensordetail[15]
                                    sensor_min = sensordetail[16]
                                    sensor_weight = sensordetail[17]
                                    sensor_deviation = sensordetail[18]

                                    sensor_st_over_ex = sensordetail[19]
                                    sensor_st_over_wt = sensordetail[20]
                                    sensor_dev_over_ex = sensordetail[21]
                                    sensor_dev_over_wt = sensordetail[22]
                                    sensor_null_ex = sensordetail[23]
                                    sensor_default_wt = sensordetail[24]

                                    print("sensor_st_over_ex", sensor_st_over_ex, "sensor_st_over_wt",sensor_st_over_wt,"sensor_dev_over_ex",sensor_dev_over_ex,"sensor_dev_over_wt",sensor_dev_over_wt,"sensor_null_ex",sensor_null_ex)
                                    sensor_initial_data = sensordetail[25]
                                    sensor_gauge_factor = sensordetail[26]

                                    sensor_id = str(sensordetail[0])
                                    project_id = str(sensordetail[27])

                                    sensorgroup_id = str(sensordetail[28])

                                  
                                    # raw data save
                                    sql = "select * from tbl_rawdata where sensor_data_date ='"+sensor_data_date+"' and datarogger_id='"+datarogger_id+"' and sensor_name='"+sensor_name+"';"

                                    mycursor.execute(sql)
                                    rawdata = mycursor.fetchone() 

                                    if rawdata is None:
                                        print("rawdata is None")
                                        sql = """insert into tbl_rawdata (sensor_data_date, sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_data+"', '"+ sensor_index+"', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                        mycursor.execute(sql)
                                        mydb.commit()

                                    

                                    sql = "select * from tbl_editdata where sensor_data_date ='"+sensor_data_date+"' and datarogger_id='"+datarogger_id+"' and sensor_name='"+sensor_name+"';"

                                    mycursor.execute(sql)
                                    editdata = mycursor.fetchone() 

                                    if editdata is None:



                                        if sensor_null_ex == 'Y':
                                            sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                            mycursor.execute(sql)
                                            pre_data_raw = mycursor.fetchone() 


                                            # pre_data_raw = file.loc[idx-1]
                                            pre_datetime_data_raw = str(pre_data_raw[1])
                                            pre_date = str(pre_data_raw[0])
                                            
                                            # sql = "select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+pre_datetime_data_raw+"';"
                                        
                                            # mycursor.execute(sql)
                                            # pre_sensor_data = mycursor.fetchone() 
                                        
                                            sensor_edit_data = str(pre_date)

                                        else:
                                            try:
                                                float(sensor_edit_data)
                                            except Exception as e:
                                                print("sensorerror")
                                                sensor_edit_data ='99999'
                                                current_sensor_null = 'Y'


                                        if current_sensor_null == 'N':

                                            if sensor_default_wt == 'Y' and sensor_weight is not None:
                                                print("sensor_default_wt : Y and sensor weight is not None")

                                                sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                mycursor.execute(sql)
                                                pre_data_raw = mycursor.fetchone() 


                                                # pre_data_raw = file.loc[idx-1]
                                                pre_datetime_data_raw = str(pre_data_raw[1])
                                                pre_date = str(pre_data_raw[0])
                                            
                                                # sql = "select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+pre_datetime_data_raw+"';"
                                            
                                                # mycursor.execute(sql)
                                                # pre_sensor_data = mycursor.fetchone() 

                                                diff = float(pre_date) - float(sensor_edit_data)
                                                sensor_weigh_data = float(diff)*float(sensor_weight)
                                                sensor_edit_data = str(float(sensor_edit_data)+float(sensor_weigh_data))

                                                # sensor_edit_data = str(float(sensor_data)+float(sensor_data)*float(sensor_weight))

                                            else:

                                                if sensor_st_over_ex == 'Y':
                                                    print("sensor_st_over_ex : Y and sensor_max is not None and sensor_min is not None")
                                                
                                                    if (sensor_max is not None and float(sensor_edit_data) > float(sensor_max)) or (sensor_min is not None and float(sensor_edit_data) < float(sensor_min)):
                                                    
                                                        sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                        mycursor.execute(sql)
                                                        pre_data_raw = mycursor.fetchone() 


                                                        # pre_data_raw = file.loc[idx-1]
                                                        pre_datetime_data_raw = str(pre_data_raw[1])
                                                        pre_date = str(pre_data_raw[0])


                                                    
                                                        # sql = "select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+pre_datetime_data_raw+"';"
                                                    
                                                        # mycursor.execute(sql)
                                                        # pre_sensor_data = mycursor.fetchone() 
                                                
                                                        sensor_edit_data = str(pre_date)
                                                    

                                                # ????????? ??????/?????? ??? ????????? ????????? ??????
                                                elif sensor_st_over_wt == 'Y':
                                                    print("sensor_st_over_wt : Y and sensor_max is not None and sensor_min is not None")
                                                    # pre_data_raw = file.loc[idx-1]

                                            
                                                    if sensor_max is not None and float(sensor_edit_data) > float(sensor_max) and sensor_weight is not None:

                                                        sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                        mycursor.execute(sql)
                                                        pre_data_raw = mycursor.fetchone() 
                                                        
                                                        pre_datetime_data_raw = str(pre_data_raw[1])
                                                        pre_date = str(pre_data_raw[0])

                                                        diff = float(sensor_edit_data) - float(sensor_max)
                                                        sensor_weigh_data = float(diff)*float(sensor_weight)
                                                        sensor_edit_data = str(float(pre_date)+float(sensor_weigh_data))


                                                    elif sensor_min is not None and float(sensor_edit_data) < float(sensor_min) and sensor_weight is not None:

                                                        sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                        mycursor.execute(sql)
                                                        pre_data_raw = mycursor.fetchone() 

                                                        pre_datetime_data_raw = str(pre_data_raw[1])
                                                        pre_date = str(pre_data_raw[0])
                                                        

                                                        diff =  float(sensor_edit_data) - float(sensor_min)
                                                        sensor_weigh_data = float(diff)*float(sensor_weight)
                                                        sensor_edit_data = str(float(pre_date)+float(sensor_weigh_data))





                                                # ???????????? ??????/?????? ??? ?????? ???????????? ??????
                                                elif sensor_dev_over_ex == 'Y' and sensor_deviation is not None:
                                                    print("sensor_dev_over_ex : Y and sensor_deviation is not None ")
                                                
                                                    sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                    mycursor.execute(sql)
                                                    pre_data_raw = mycursor.fetchone() 

                                                    pre_datetime_data_raw = str(pre_data_raw[1])
                                                    pre_date = str(pre_data_raw[0])
                                                    
                                                    diff = abs(float(pre_date) - float(sensor_edit_data))

                                                    
                                                    if diff > float(sensor_deviation):
                                                        sensor_edit_data = str(pre_date)


                                                # ???????????? ??????/?????? ??? ????????? ????????? ??????
                                                elif sensor_dev_over_wt == 'Y' and sensor_weight is not None and sensor_deviation is not None:
                                                    print("sensor_dev_over_wt : Y and sensor_weight is not None and sensor_deviation is not None")
                                                
                                                    sql = """select sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"""+datarogger_id+"""' and sensor_name = '"""+sensor_name+"""' and sensor_data_date < '"""+sensor_data_date+"""'
                                                            order by sensor_data_date desc
                                                            limit 1"""

                                                    mycursor.execute(sql)
                                                    pre_data_raw = mycursor.fetchone() 

                                                    pre_datetime_data_raw = str(pre_data_raw[1])
                                                    pre_date = str(pre_data_raw[0])
                                                    
                                                    
                                                    diff = float(sensor_edit_data) - float(pre_date)
                                                    print("diff", diff, abs(diff),sensor_deviation), 
                                                    if abs(diff) > float(sensor_deviation):
                                                        sensor_weigh_data = float(diff)*float(sensor_weight)
                                                        print("sensor_weigh_data", sensor_weigh_data)
                                                        sensor_edit_data = str(float(pre_date)+float(sensor_weigh_data))
                                                        print("sensor_edit_data", sensor_edit_data)
                                                        


                                        # ?????? ????????? ?????? ??????
                                        print("sensor_fx", sensor_fx, sensor_name)
                                        print("sensor_edit_data", sensor_edit_data, sensor_name)
                                        print("sensor_initial_data", sensor_initial_data, sensor_name)
                                        print("sensor_gauge_factor", sensor_gauge_factor, sensor_name)

                                        if sensor_fx is not None and sensor_initial_data is not None and sensor_gauge_factor is not None:


                                            current_fx = sensor_fx

                                            current_fx = current_fx.replace('$sen', sensor_edit_data)
                                            current_fx = current_fx.replace('$ini', sensor_initial_data)
                                            current_fx = current_fx.replace('$GF', sensor_gauge_factor)
                                            fx_result = eval(current_fx)

                                            

                                        else:
                                            fx_result = None

                                        print("fx_result",fx_result)
                                        print("sensorgroup_id",sensorgroup_id, type(sensorgroup_id))

                                        if sensorgroup_id != 'None':
                                    
                                            sql = """select sensorgroup_type,sensorgroup_gl1_max,sensorgroup_gl1_min,sensorgroup_gl2_max,sensorgroup_gl2_min,sensorgroup_gl3_max,sensorgroup_gl3_min,sensorgroup_fx, sensorgroup_gauge_factor, function_formula from tbl_sensorgroup a
                                                        left join tbl_function b on a.sensorgroup_fx = b.function_id
                                                        where sensorgroup_id ='"""+sensorgroup_id+"""'"""
                                            mycursor.execute(sql)
                                            sensorgroup = mycursor.fetchone()

                                            # ?????? ?????? ???????????????
                                            sensorgroup_type = sensorgroup[0]
                                            sensorgroup_gl1_max = sensorgroup[1]
                                            sensorgroup_gl1_min = sensorgroup[2]
                                            sensorgroup_gl2_max = sensorgroup[3]
                                            sensorgroup_gl2_min = sensorgroup[4]
                                            sensorgroup_gl3_max = sensorgroup[5]
                                            sensorgroup_gl3_min = sensorgroup[6]
                                            if sensorgroup_type == '0201':
                                                sensorgroup_gl1_max_0201 = sensorgroup[1]
                                                sensorgroup_gl1_min_0201 = sensorgroup[2]
                                                sensorgroup_gl2_max_0201 = sensorgroup[3]
                                                sensorgroup_gl2_min_0201 = sensorgroup[4]
                                                sensorgroup_gl3_max_0201 = sensorgroup[5]
                                                sensorgroup_gl3_min_0201 = sensorgroup[6]




                                        print("editdata is None save data")

                                        sql = """insert into tbl_editdata (sensor_data_date, sensor_name, sensor_data, sensor_index, edit_yn, use_yn, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_edit_data+"', '"+ sensor_index+"', 'N', 'Y', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                        mycursor.execute(sql)
                                        mydb.commit()

                                        print("datasave and guide line check start")

                                        if fx_result is not None:
                                            print("fx_result is not None")

                                            if sensorgroup_id != 'None' and sensorgroup_type == '0201':
                                                vertical.append({"fx_result": fx_result, "sensor_id":sensor_id, "sensor_id":sensor_name})
                                        
                                            if (sensor_gl3_max != 'None' and float(sensor_gl3_max) < float(fx_result)) or (sensor_gl3_min != 'None' and float(sensor_gl3_min) > float(fx_result)):
                                                print("lv3")
                                            
                                                sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                                mycursor.execute(sql)
                                                findeditdata = mycursor.fetchone()
                                        
                                                editdata_id = str(findeditdata[0])
                                            
                                                sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                                sql += "3"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                        
                                                mycursor.execute(sql)
                                                mydb.commit()

                                            elif (sensor_gl2_max != 'None' and float(sensor_gl2_max) < float(fx_result)) or (sensor_gl2_min != 'None' and float(sensor_gl2_min) > float(fx_result)):
                                                
                                                print("lv2")
                                                sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                                mycursor.execute(sql)
                                                findeditdata = mycursor.fetchone()
                                        
                                                editdata_id = str(findeditdata[0])
                                            
                                                sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                                sql += "2"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                            
                                                mycursor.execute(sql)
                                                mydb.commit()

                                            elif (sensor_gl1_max != 'None' and float(sensor_gl1_max) < float(fx_result)) or (sensor_gl1_min != 'None' and float(sensor_gl1_min) > float(fx_result)):

                                                print("lv1")
                                                sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                                mycursor.execute(sql)
                                                findeditdata = mycursor.fetchone()
                                        
                                                editdata_id = str(findeditdata[0])
                                            
                                                sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                                sql += "1"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                                
                                                mycursor.execute(sql)
                                                mydb.commit()
                                            



                            

                                    
                                    # sql = "select * from tbl_editdata where sensor_data_date ='"+sensor_data_date+"' and datarogger_id='"+datarogger_id+"' and sensor_name='"+sensor_name+"';"

                                    # mycursor.execute(sql)
                                    # editdata = mycursor.fetchone() 
                                    

                                    
                                    # if editdata is None:
                                    #     print("editdata is None")

                                    #     sql = """insert into tbl_editdata (sensor_data_date, sensor_name, sensor_data, sensor_index, edit_yn, use_yn, datarogger_id, create_date, modify_date) values
                                    #     ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_edit_data+"', '"+ sensor_index+"', 'N', 'Y', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                    #     mycursor.execute(sql)
                                    #     mydb.commit()

                                    #     if fx_result is not None:
                                    #         print("fx_result is not None")

                                    #         if sensorgroup_id != 'None' and sensorgroup_type == '0201':
                                    #             vertical.append({"fx_result": fx_result, "sensor_id":sensor_id, "sensor_id":sensor_name})
                                        
                                    #         if (sensor_gl3_max != 'None' and float(sensor_gl3_max) < float(fx_result)) or (sensor_gl3_min != 'None' and float(sensor_gl3_min) > float(fx_result)):
                                    #             print("lv3")
                                            
                                    #             sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                    #             mycursor.execute(sql)
                                    #             findeditdata = mycursor.fetchone()
                                        
                                    #             editdata_id = str(findeditdata[0])
                                            
                                    #             sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                    #             sql += "3"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                        
                                    #             mycursor.execute(sql)
                                    #             mydb.commit()

                                    #         elif (sensor_gl2_max != 'None' and float(sensor_gl2_max) < float(fx_result)) or (sensor_gl2_min != 'None' and float(sensor_gl2_min) > float(fx_result)):
                                                
                                    #             print("lv2")
                                    #             sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                    #             mycursor.execute(sql)
                                    #             findeditdata = mycursor.fetchone()
                                        
                                    #             editdata_id = str(findeditdata[0])
                                            
                                    #             sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                    #             sql += "2"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                            
                                    #             mycursor.execute(sql)
                                    #             mydb.commit()

                                    #         elif (sensor_gl1_max != 'None' and float(sensor_gl1_max) < float(fx_result)) or (sensor_gl1_min != 'None' and float(sensor_gl1_min) > float(fx_result)):

                                    #             print("lv1")
                                    #             sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                    #             mycursor.execute(sql)
                                    #             findeditdata = mycursor.fetchone()
                                        
                                    #             editdata_id = str(findeditdata[0])
                                            
                                    #             sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                    #             sql += "1"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                                
                                    #             mycursor.execute(sql)
                                    #             mydb.commit()

                                if i == len(data_raw)-1:
                                    print("last idx!!!!!!!",idx)
                                    verticaltotal = 0
                                    for j in range(len(vertical)):
                                        currend_j = len(vertical)-j-1
                                        sensor_fx_result = vertical[currend_j]['fx_result']
                                        current_sensor_id = vertical[currend_j]['sensor_id']
                                        current_sensor_name = vertical[currend_j]['sensor_name']
                                        # print(vertical[currend_i])
                                        verticaltotal += float(sensor_fx_result)



                                        if (sensorgroup_gl3_max_0201 != 'None' and float(sensorgroup_gl3_max_0201) < float(verticaltotal)) or (sensorgroup_gl3_min_0201 != 'None' and float(sensorgroup_gl3_min_0201) > float(verticaltotal)):
                        
                    
                                        # sensor_data_date = "2022-01-05 18:00:00"
                                    
                                            sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+current_sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                            mycursor.execute(sql)
                                            findeditdata = mycursor.fetchone()
                                    
                                            editdata_id = str(findeditdata[0])
                                        
                                            sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                            sql += "3"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+current_sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                        
                                            mycursor.execute(sql)
                                            mydb.commit()

                                        elif (sensorgroup_gl2_max_0201 != 'None' and float(sensorgroup_gl2_max_0201) < float(verticaltotal)) or (sensorgroup_gl2_min_0201 != 'None' and float(sensorgroup_gl2_min_0201) > float(verticaltotal)):
                                            

                                            # sensor_data_date = "2022-01-05 18:00:00"
                                        
                                            sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+current_sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                            mycursor.execute(sql)
                                            findeditdata = mycursor.fetchone()
                                    
                                            editdata_id = str(findeditdata[0])
                                        
                                            sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                            sql += "2"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+current_sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                        
                                            mycursor.execute(sql)
                                            mydb.commit()

                                        elif (sensorgroup_gl1_max_0201 != 'None' and float(sensorgroup_gl1_max_0201) < float(verticaltotal)) or (sensorgroup_gl1_min_0201 != 'None' and float(sensorgroup_gl1_min_0201) > float(verticaltotal)):

                                
                                            # sensor_data_date = "2022-01-05 18:00:00"
                                        
                                            sql = "select editdata_id, sensor_data, sensor_data_date from tbl_editdata where datarogger_id = '"+datarogger_id+"' and sensor_name = '"+current_sensor_name+"' and sensor_data_date = '"+sensor_data_date+"';"
                                            mycursor.execute(sql)
                                            findeditdata = mycursor.fetchone()
                                    
                                            editdata_id = str(findeditdata[0])
                                        
                                            sql = "insert into tbl_alarm (alarm_detail, alarm_status, alarm_post_request, alarm_post_yn, sensor_id, datarogger_id,editdata_id, sensor_data_date, use_yn,project_id, create_date, modify_date) values ('"
                                            sql += "1"+"','"+"N"+"','"+"request"+"','"+"N"+"','"+current_sensor_id+"','"+datarogger_id+"','"+editdata_id+"','"+sensor_data_date+"','"+"Y"+"','"+project_id+"','"+create_date+"','"+modify_date+"');"
                                        
                                            mycursor.execute(sql)
                                            mydb.commit()
                                            
                                      
                                        
                                        

                    else:
                        print("else")
                        for i in range(len(data_raw)):
                            sensor_data_date =  data_raw[0]
                            if(i > 0):
                                sensor_name = data_raw.index[i]
                                sensor_data = str(data_raw[i])
                                sensor_edit_data = str(data_raw[i])
                                sensor_index = str(i-2)

                                sql = """insert into tbl_rawdata (sensor_data_date, sensor_name, sensor_data, sensor_index, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_data+"', '"+ sensor_index+"', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

                                mycursor.execute(sql)
                                mydb.commit()

                                try:
                                    
                                    float(sensor_edit_data)
                                except Exception as e:
                                    sensor_edit_data ='99999'

                                sql = """insert into tbl_editdata (sensor_data_date, sensor_name, sensor_data, sensor_index, edit_yn, use_yn, datarogger_id, create_date, modify_date) values
                                        ('"""+sensor_data_date+"', '"+sensor_name+"', '"+ sensor_edit_data+"', '"+ sensor_index+"', 'N', 'Y', '"+ datarogger_id+"', '"+ create_date+"', '"+ modify_date+"');"

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
