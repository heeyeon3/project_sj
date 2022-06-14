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
from models.project import ProjectModel
from models.weather import weatherModel
from config.properties import *
import requests 
import pandas as pd

from datetime import datetime, timedelta
import mysql.connector

class weather:

    def weathersave(self):
        
        print("!!")


        # url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
        # params ={'ServiceKey' : 'Eq6Jwlawb5k2crN6QtO7WMCep3AkyFYNCHC/tyJ7JSY2drD8vRIJ3m6bfVPOg1tmn/yuvKopW1vteBA8+xxr5g==', 'pageNo' : '1', 'numOfRows' : '1000', 'dataType' : 'JSON', 'base_date' : '20220503', 'base_time' : '1730', 'nx' : '55', 'ny' : '127' }

        # response = requests.get(url, params=params)
        # print(response.content)

        # js = json.loads(response.content)
        # data = pd.DataFrame(js['response']['body']['items']['item'])
        # print(data)

        #3시간별로 돌떄 base_date
        today = datetime.now()
        basedate = str(today)[0:4]+str(today)[5:7]+str(today)[8:10]
        print(basedate)

        #3시간별로 돌떄 basetime
        currenthour = today.hour
        print(currenthour)
        basetime = ""
        if currenthour >= 0 and currenthour < 3:
            basetime = '0030'

        elif currenthour >= 3 and currenthour < 6:
            basetime = '0330'

        elif currenthour >= 6 and currenthour < 9:
            basetime = '0630'

        elif currenthour >= 9 and currenthour < 12:
            basetime = '0930'

        elif currenthour >= 12 and currenthour < 15:
            basetime = '1230'

        elif currenthour >= 15 and currenthour < 18:
            basetime = '1530'

        elif currenthour >= 18 and currenthour < 21:
            basetime = '1830'

        elif currenthour >= 21 and currenthour < 24:
            basetime = '2130'

        # print(type(currenthour))
        # print(today)
        # print(today.hour)
        print(basetime)



        mydb = mysql.connector.connect(
            host =          "218.38.232.231",
            user =          "sjgeotec",
            password =      "sjgeotecWkd!",
            database =      "SJGEOTEC",
            auth_plugin=    'mysql_native_password'
        )


        try:
            mycursor = mydb.cursor()

            sql = """select distinct project_weather_nx, project_weather_ny from tbl_project
                    where project_weather_nx is not null and project_weather_ny is not null"""
            mycursor.execute(sql)
                
            # rowlist = mycursor.fetchone()
            rowlist = mycursor.fetchall()

            for row in rowlist:
                # print(row)
                nx = row[0]
                ny = row[1]

                print(nx, ny)

                url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
                params ={'ServiceKey' : 'Eq6Jwlawb5k2crN6QtO7WMCep3AkyFYNCHC/tyJ7JSY2drD8vRIJ3m6bfVPOg1tmn/yuvKopW1vteBA8+xxr5g==', 'pageNo' : '1', 'numOfRows' : '1000', 'dataType' : 'JSON', 'base_date' : basedate, 'base_time' : basetime, 'nx' : nx, 'ny' : ny }

                response = requests.get(url, params=params)
                # print(response.content)

                js = json.loads(response.content)
                data = pd.DataFrame(js['response']['body']['items']['item'])
            

                t1h = data[data['category'] == 'T1H'] 
                t1h = t1h.reset_index(drop=True)
                # print(t1h)

                # print(len(t1h))
                # print(t1h['baseDate'].loc[0])
                rn1 = data[data['category'] == 'RN1'] 
                rn1 = rn1.reset_index(drop=True)

                print(rn1)


                for idx in range(len(t1h)):
                    weather_date = t1h['fcstDate'].loc[idx][0:4] + "-" + t1h['fcstDate'].loc[idx][4:6] + "-" + t1h['fcstDate'].loc[idx][6:8] + " " + t1h['fcstTime'].loc[idx][0:2]+":00:00"
                    print(weather_date)
                   
                    sql = """select * from tbl_weather where weather_date = '"""+weather_date+"' and weather_nx='"+nx+"' and weather_ny='"+ny+"'"

                    # print(sql)
                    mycursor.execute(sql)
                    weahterlist = mycursor.fetchall()

                    # print(weahterlist)
                    # print(len(weahterlist))

                    if len(weahterlist) == 0:

                        t1h_value = t1h['fcstValue'].loc[idx]
                        rn1_value = rn1['fcstValue'].loc[idx]

                        if rn1_value == '강수없음':
                            rn1_value = '0'
                        elif rn1_value == '1.0mm 미만':
                            rn1_value = '0'
                        elif rn1_value == '50.0mm 이상':
                            rn1_value = '50'
                        elif rn1_value == '30.0~50.0mm':
                            rn1_value = '30'
                        else:
                            # rn1_value ='20.2mm'
                            rn1_value = rn1_value[0:len(rn1_value)-2]

                        print(rn1_value)

                        create_date = str(datetime.now())
                        sql = """insert into tbl_weather(weather_date, weather_nx, weather_ny, weather_t1h, weather_rn1, create_date) values (
                                '"""+weather_date+"','"+nx+"','"+ny+"','"+t1h_value+"','"+rn1_value+"','"+create_date+"');"

                        # print(sql)
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



class weatherdata(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('company_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('date_time_start', type=str)
    parse.add_argument('date_time_end', type=str)
    parse.add_argument('intervalday', type=str)
    

    def get(self):

        project_id =              request.args.get('project_id')
        date_time_start =              request.args.get('date_time_start')
        date_time_end =              request.args.get('date_time_end')
        print(project_id, date_time_end,date_time_start)
        project_obj = ProjectModel.find_by_id(project_id)

        nx = project_obj.project_weather_nx
        ny = project_obj.project_weather_ny

        params = (nx, ny, date_time_start, date_time_end)

        data = [dict(r) for r in weatherModel.weather_data(params)]
       
        
       

        return {'resultCode': '0', "resultString": "SUCCESS", "data": data}, 200


    def post(self):

        params = weatherdata.parse.parse_args()
        print(params)

        project_id =              params['project_id']
        date_time_start =              params['date_time_start']
        date_time_end =              params['date_time_end']
        intervalday =              params['intervalday']
        print(project_id, date_time_end,date_time_start)
        project_obj = ProjectModel.find_by_id(project_id)

        nx = project_obj.project_weather_nx
        ny = project_obj.project_weather_ny

        params = (nx, ny, date_time_start, date_time_end)

        start = datetime.strptime(date_time_start[0:10], "%Y.%m.%d")
        end = datetime.strptime(date_time_end[0:10], "%Y.%m.%d")

        dates = []
        dates = pd.date_range(start=start, end=end, freq='1d')
        dates = dates.sort_values(ascending = False)
        sortdateall = []

        for i in range(len(dates)):
            date_i = str(dates[i])
            sortdateall.append(date_i[0:4]+"."+date_i[5:7]+"."+date_i[8:10])

        sortdate = []

        sortdate.append(str(end)[0:4]+"."+str(end)[5:7]+"."+str(end)[8:10])
        befor_days = datetime.now()
        day_i = 1
        while start < befor_days:
            befor_days = end - timedelta(days= day_i * int(intervalday))
            befor_one_days = str(befor_days)
            sortdate.append(befor_one_days[0:4]+"."+befor_one_days[5:7]+"."+befor_one_days[8:10])
            day_i += 1

        

        print(sortdate)

        weatherdatalist = [dict(r) for r in weatherModel.weather_data_avg_day(params)]
        print(weatherdatalist)
        data = []
        for i in range(len(weatherdatalist)):
            currentdate = str(weatherdatalist[i]['weather_date'])
            print(currentdate)
            current_t1h = 0
            current_rn1 = 0
            if currentdate in sortdate:
                dateindex = sortdateall.index(currentdate)

                for idx in range(int(intervalday)):
                    currentIndex = dateindex + idx

                    if currentIndex < len(sortdateall):

                        lastdate = sortdateall[currentIndex]

                        for j in range(len(weatherdatalist)):
                            if str(weatherdatalist[j]['weather_date']) == str(lastdate):
                                if float(weatherdatalist[j]['weather_t1h']) > float(current_t1h):
                                    current_t1h = weatherdatalist[j]['weather_t1h']
                                if float(weatherdatalist[j]['weather_rn1']) > float(current_rn1):
                                    current_t1h = weatherdatalist[j]['weather_rn1']

                                break
                    
                    if idx == int(intervalday)-1:
                        data.append({'weather_date': weatherdatalist[i]['weather_date'], 'weather_t1h':current_t1h, 'weather_rn1':current_rn1})



       
        
       

        return {'resultCode': '0', "resultString": "SUCCESS", "data": data}, 200