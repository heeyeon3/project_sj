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

from datetime import datetime


class company(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('company_id',   type=str)
    parse.add_argument('company_set_id',   type=str)
    parse.add_argument('company_name',    type=str)
    parse.add_argument('company_ceo',   type=str)
    parse.add_argument('company_regnum',    type=str)
    parse.add_argument('company_worktype',   type=str)
    parse.add_argument('company_workcate',    type=str)
    parse.add_argument('company_email',   type=str)
    parse.add_argument('company_number',    type=str)
    parse.add_argument('company_faxnum',   type=str)
    parse.add_argument('company_address',    type=str)
    parse.add_argument('company_picname',   type=str)
    parse.add_argument('company_picnum',    type=str)
    parse.add_argument('company_picemail',    type=str)
    parse.add_argument('company_img',    type=str)
    parse.add_argument('use_yn',    type=str)
    parse.add_argument('user_id',    type=str)
    parse.add_argument('user_pwd',    type=str)

    def get(self):
        company_id =              request.args.get('company_id')


        resultString = [dict(r) for r in CompanyModel.find_by_company_id(company_id)]
    
        return {"resultCode" : '0', "data" : resultString}




    def post(self):

        params = company.parse.parse_args()
        

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
        
        use_yn =           "Y"            
       
        user_id = params['user_id']
        user_pwd = params['user_pwd']
        current_user_id = current_user.user_id
        create_date =     datetime.now()
        modify_date =     datetime.now()


        company_set_id_obj = CompanyModel.find_by_company_set_id(company_set_id)

        # if(company_set_id_obj):
        #     return {'resultCode': '0', "resultString": "중복된 아이디 입니다."}, 200
        # else:

        user_obj = UserModel.find_by_id(user_id)
       
        if user_obj:
       
            return {'resultCode': '0', "resultString": "관리자 계정 아이디가 중복되었습니다."}, 200
    
        try:
            company_obj = CompanyModel(company_set_id, company_name, company_ceo, company_regnum, company_worktype, company_workcate, company_email, company_number, company_faxnum, company_address, company_picname, company_picnum, company_picemail, "", use_yn, current_user_id, create_date, modify_date)
            company_obj.save_to_db()

            company_set_id_obj = CompanyModel.find_by_company_set_id(company_set_id)
          
            if(company_set_id_obj):
                company_id = company_set_id_obj.company_id
               
                #회사 관리자 추가
                user_obj = UserModel(user_id, user_pwd, company_name, "0102", create_date, use_yn, company_id, '0', create_date, modify_date)
                user_obj.save_to_db()

  
                if params['company_img'] and params['company_img'] !='undefined' and len(params['company_img']) !=0:
   
                    company_img = request.files['company_img']
              
                    # DB 저장 필드
                    # 파일명 추출 (파일명에 띄어쓰기 있는경우 파일명이 중간에 잘림)
                    cont_org_nm = str(company_img.filename.replace(" ", "_"))           # 필드 생성 후 저장 해야함
                    fname, ext = os.path.splitext(cont_org_nm)
                    company_img_name = fname + "_"  + str(int(time.time())) + ext
                    
                
                    # 파일 업로드 디렉토리 세팅
                    cont_path = shot_file + str(company_id) + '/company_img'
                
                    try:

                        if not FileUtils.save_file(company_img, cont_path, company_img_name):
                            raise Exception('not save image %s' % cont_path + company_img_name)

                        img_url = root_url + 'shot/' + str(company_id) + '/company_img'+ '/' + company_img_name


                    except Exception as e:

                        logging.fatal(e, exc_info=True)
                        print("Screenshot FAIL")

                        return {'resultCode': '100', "resultString": "Screen Shot 파일 업로드에 실패하였습니다."}, 500
                else:
                    print("파일이 존재하지 않습니다.")
                    img_url = None

                    # return {'resultCode': '0', "resultString": "Screen Shot 파일이 존재하지 않습니다"}, 200

                

                company_obj = CompanyModel.find_by_id(company_id)
                company_obj.company_img = img_url
                company_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "고객사가 등록 되었습니다."}, 200



    def put(self):
  
        # company_id =              request.args.get('company_id')

        # print(company_id)
        
        params = company.parse.parse_args()

        
        user_id =   params['user_id']
        user_pwd =   params['user_pwd']
        company_id =   params['company_id']
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
   
        modify_date = datetime.now()
  
        
   

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
            company_obj.company_img  = None
         
            company_obj.modify_date  = modify_date
            company_obj.save_to_db()

            user_obj = UserModel.find_by_id(user_id)
            user_obj.user_pwd = user_pwd
            user_obj.save_to_db()

        except Exception as e:

                logging.fatal(e, exc_info=True)
                return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "프로젝트가 등록 되었습니다."}, 200

class companylist(Resource):

    parse = reqparse.RequestParser()

    def post(self):

        params = companylist.parse.parse_args()

        data = [dict(r) for r in CompanyModel.company_list()]

        projectstat = [dict(r) for r in CompanyModel.company_project()]

        for idx in range(len(data)):
            data[idx]['W'] = 0
            data[idx]['N'] = 0
            data[idx]['C'] = 0

        for idx in range(len(data)):

            for i in range(len(projectstat)):

                if data[idx]['company_id'] ==  projectstat[i]['company_id']:
                    data[idx]['W'] = projectstat[i]['W']
                    data[idx]['N'] = projectstat[i]['N']
                    data[idx]['C'] = projectstat[i]['C']


        return {'resultCode': '0', "resultString": "Succes", "data": data}, 200



        
