from copyreg import constructor
from datetime import datetime
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from resource.company import company
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import json
from models.editdata import EditdataModel
from models.sensor import SensorModel
from models.fuction import FunctionModel
from models.sensorgroup import SensorgroupModel
from models.user import UserModel
from models.project import ProjectModel
import logging
from math import pi, sin, cos, tan, log, e
import math
import random


class FunctionFormula(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_name', type=str)
    parse.add_argument('function_formula', type=str)
    parse.add_argument('function_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('company_id', type=str)
    parse.add_argument('fomula_status', type=str)


    def get(self):

       
    
        data = [dict(r) for r in FunctionModel.find_by_all()]
     
        # print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200




    def post(self):
        params = FunctionFormula.parse.parse_args()

        function_formula  = params['function_formula']
        function_name  = params['function_name']
        project_id  = params['project_id']
        company_id  = params['company_id']
        fomula_status  = params['fomula_status']
        # print(project_id)

        # print("!!!!", pi, sin(2*pi), log(10,10), math.e)
        fumula  = params['function_formula']
        # print(fumula)
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
        # print(fumula)

        numlist1 = []
        numlist2 = []
        numlist3 = []
        # num = random.randrange(-4000, 4000)
        # numlist.append(num)
        # print(num)
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 4000)
            num2 = random.uniform(0, 4000)
            num3 = random.uniform(0, 1)
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)

        print(numlist1)

     
        user_id = current_user.user_id
        print(project_id)
        if company_id is None:
            porject_obj = ProjectModel.find_by_id(project_id)
            company_id = str(porject_obj.company_id)

        create_date = datetime.now()
        modify_date = datetime.now()



        try:

            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)
     

            # 0000 성진지오텍 0001 고객사 0002 프로젝트 0205 로드셀
            function_obj = FunctionModel(function_name, function_formula, fomula_status, 'Y',  user_id, project_id, company_id, create_date, modify_date)
            function_obj.save_to_db()
      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 등록되었습니다."}, 200


    def delete(self):

        # print("공식 삭제")
        function_id =              request.args.get('function_id')
        # print(function_id)
        function_obj = FunctionModel.find_by_id(function_id)

        modify_date = datetime.now()

        try:
            function_obj.use_yn = 'N'
            function_obj.modify_date = modify_date
            function_obj.save_to_db()
           
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 삭제되었습니다."}, 200

    


class FormulaProject(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_name', type=str)
    parse.add_argument('function_formula', type=str)
    parse.add_argument('function_id', type=str)
    parse.add_argument('project_id', type=str)


    def get(self):

        project_id =              request.args.get('project_id')
        # print(project_id)
    
        data = [dict(r) for r in FunctionModel.find_by_project_id(project_id)]
     
        # print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200

    def post(self):
        params = FormulaProject.parse.parse_args()

        function_name  = params['function_name']
        function_formula  = params['function_formula']
        function_id  = params['function_id']

        modify_date = datetime.now()

        function_obj = FunctionModel.find_by_id(function_id)

        function_obj.function_name = function_name
        function_obj.function_formula = function_formula
        function_obj.modify_date = modify_date
        user_id = current_user.user_id

        fumula  = params['function_formula']
        print(fumula)
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
        print(fumula)

        numlist1 = []
        numlist2 = []
        numlist3 = []
        # num = random.randrange(-4000, 4000)
        # numlist.append(num)
        # print(num)
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 4000)
            num2 = random.uniform(0, 4000)
            num3 = random.uniform(0, 1)
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)

        # print(numlist1)


        try:


            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)
                
            function_obj.save_to_db()
      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "올바른 수식이 아닙니다. 수식을 확인해주세요."}, 500

        return {'resultCode': '0', "resultString": "공식이 수정되었습니다."}, 200


class FunctionFormulaCheck(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_formula', type=str)

    def get(self):
        sensorgroup_id =              request.args.get('sensorgroup_id')
        sensorgroup_fx =              request.args.get('sensorgroup_fx')

        print(sensorgroup_id,sensorgroup_fx )

        modify_date = datetime.now()
        try:
            sensougroup_obj = SensorgroupModel.find_by_id(sensorgroup_id)
            sensougroup_obj.sensorgroup_fx = sensorgroup_fx
            sensougroup_obj.modify_date = modify_date

            sensougroup_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 수정되었습니다."}, 200
        
    def post(self):
        params = FunctionFormulaCheck.parse.parse_args()

        function_formula  = params['function_formula']

        print("!!!!", pi, sin(2*pi), log(10,10), math.e)
        fumula  = params['function_formula']
        print(fumula)
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
        print(fumula)

        numlist1 = []
        numlist2 = []
        numlist3 = []
        # num = random.randrange(-4000, 4000)
        # numlist.append(num)
        # print(num)
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 5000)  # 측정값
            num2 = random.uniform(0, 5000)  # 기준값
            num3 = random.uniform(0, 1)     # 가우지팩터
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)
            # ($sen=1234, $ini=1200, Gauge Factor=0.0002
        numlist1.append(2500)
        numlist2.append(2510)
        numlist3.append(0.002)

        try:

            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)


            fumula01 = fumula
              
            fumula01 = fumula01.replace('$sen', str(2500))
            fumula01 = fumula01.replace('$ini', str(2510))
            fumula01 = fumula01.replace('$GF', str(0.002))
            result2 = eval(fumula01)

            print(result2)
     
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "올바른 수식이 아닙니다. 수식을 확인해주세요."}, 500

        return {'resultCode': '0', "resultString": [result1]}, 200




class Formularoadcell(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_name', type=str)
    parse.add_argument('function_formula', type=str)
    parse.add_argument('function_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('sensorgroup_id', type=str)


    def get(self):
        project_id =              request.args.get('project_id')
        print("project_id", project_id)
    
        data = [dict(r) for r in FunctionModel.find_by_roadcell(project_id)]
     
        print("here")
        print(data)
        print("here")
        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        params = Formularoadcell.parse.parse_args()

        function_formula  = params['function_formula']
        function_name  = params['function_name']
        project_id  = params['project_id']
        print(project_id)

        project_obj = ProjectModel.find_by_id(project_id)
        company_id = project_obj.company_id

        print("!!!!", pi, sin(2*pi), log(10,10), math.e)
        fumula  = params['function_formula']
        print(fumula)
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
        print(fumula)

        numlist1 = []
        numlist2 = []
        numlist3 = []
        # num = random.randrange(-4000, 4000)
        # numlist.append(num)
        # print(num)
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 4000)
            num2 = random.uniform(0, 4000)
            num3 = random.uniform(0, 1)
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)

        print(numlist1)

     
        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()


        try:

            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)
     


            function_obj = FunctionModel(function_name, function_formula, '0204', 'Y',  user_id, project_id, company_id,create_date, modify_date)
            function_obj.save_to_db()
      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 등록되었습니다."}, 200


    def put(self):
        print("!!")
        params = Formularoadcell.parse.parse_args()

        function_formula  = params['function_formula']
        function_name  = params['function_name']
        function_id  = params['function_id']
        sensorgroup_id  = params['sensorgroup_id']
      

        # print("!!!!", pi, sin(2*pi), log(10,10), math.e)
        fumula  = params['function_formula']
        
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
     

        numlist1 = []
        numlist2 = []
        numlist3 = []
        
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 4000)
            num2 = random.uniform(0, 4000)
            num3 = random.uniform(0, 1)
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)

     
        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()


        try:

            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)
     


                fonction_obj = FunctionModel.find_by_id(function_id)
                fonction_obj.function_formula = function_formula
                fonction_obj.function_name = function_name
                fonction_obj.modify_date = modify_date
                fonction_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 등록되었습니다."}, 200



class raoadcellfunction(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_name', type=str)
    parse.add_argument('function_formula', type=str)
    parse.add_argument('function_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('sensorgroup_id', type=str)


    def get(self):
        function_id =              request.args.get('function_id')
        print("function_id", function_id)
    
        data = [dict(r) for r in FunctionModel.select_roadcell(function_id)]

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200


class FunctionFormulaCompany(Resource):
    parse = reqparse.RequestParser()


    parse.add_argument('function_name', type=str)
    parse.add_argument('function_formula', type=str)
    parse.add_argument('function_id', type=str)
    parse.add_argument('project_id', type=str)
    parse.add_argument('company_id', type=str)


    def get(self):

        project_id = request.args.get('project_id')

        project_obj = ProjectModel.find_by_id(project_id)
        company_id = project_obj.company_id

        data = [dict(r) for r in FunctionModel.select_company_fomula(str(company_id))]
     
        # print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        params = FunctionFormula.parse.parse_args()

        function_formula  = params['function_formula']
        function_name  = params['function_name']
        project_id  = params['project_id']
        company_id  = params['company_id']
        # print(project_id)

        # print("!!!!", pi, sin(2*pi), log(10,10), math.e)
        fumula  = params['function_formula']
        # print(fumula)
        # fumula = fumula.replace('$sen', '123')
        fumula = fumula.replace('^', '**')
        fumula = fumula.replace('ln', 'math.log10')
        # print(fumula)

        numlist1 = []
        numlist2 = []
        numlist3 = []
        # num = random.randrange(-4000, 4000)
        # numlist.append(num)
        # print(num)
        for i in range(100):
            # print(i)
            num1 = random.uniform(0, 4000)
            num2 = random.uniform(0, 4000)
            num3 = random.uniform(0, 1)
            numlist1.append(num1)
            numlist2.append(num2)
            numlist3.append(num3)

        # print(numlist1)

     
        user_id = current_user.user_id
        user_grade = UserModel.find_by_id(user_id).user_grade

        
        create_date = datetime.now()
        modify_date = datetime.now()

        project_obj = ProjectModel.find_by_id(project_id)
        company_id = project_obj.company_id
        # print("company_id", company_id)


        try:

            for i, j, w in zip(numlist1, numlist2, numlist3):
             
                fumula01 = fumula
              
                fumula01 = fumula01.replace('$sen', str(i))
                fumula01 = fumula01.replace('$ini', str(j))
                fumula01 = fumula01.replace('$GF', str(w))
               
                result1 = eval(fumula01)
     

            # 0000 성진지오텍 0001 고객사 0002 프로젝트 0205 로드셀
            project_id = '0'
            function_obj = FunctionModel(function_name, function_formula, '0001', 'Y',  user_id, project_id, company_id, create_date, modify_date)
            function_obj.save_to_db()
      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공식이 등록되었습니다."}, 200