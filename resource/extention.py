import re
import resource
from cv2 import completeSymm
from flask_jwt_extended import jwt_required
from flask_login import current_user
from flask_restful import Resource, reqparse, request
from models.project import ProjectModel
from resource.project import project
from utils.jsonutil import AlchemyEncoder as jsonEncoder
import logging
import json
from models.extention import ExtentionModel
from models.user import UserModel

from datetime import datetime


class extention(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('extention_st_dt',   type=str)
    parse.add_argument('extention_ed_dt',    type=str)
    parse.add_argument('extention_cost',   type=str)
    parse.add_argument('extention_memo',   type=str)
    parse.add_argument('project_id',   type=str)
    parse.add_argument('extention_id',   type=str)

    def get(self):
        
        extention_id =              request.args.get('extention_id')

        result_string = json.dumps(ExtentionModel.find_by_id(extention_id), cls=jsonEncoder)

        return {'resultCode': '0', "resultString": "Succes", "data": result_string}, 200

    def post(self):

        params = extention.parse.parse_args()
        print("!!!!")
        print(params)
        

        extention_st_dt =     params['extention_st_dt']
        extention_ed_dt =     params['extention_ed_dt']                             
        extention_cost =      params['extention_cost']
        extention_memo =      params['extention_memo']
        project_id =          params['project_id']

        use_yn = 'Y'
        user_id = current_user.user_id
        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()

        

        try:
            # project_obj = ProjectModel.find_by_id(project_id)
            # project_obj.project_last_date = extention_ed_dt

            # project_obj.project_total_cost = int(project_obj.project_total_cost)+int(extention_cost)

            # project_obj.save_to_db()
            extention_obj = ExtentionModel(extention_cost, extention_memo, extention_st_dt, extention_ed_dt, use_yn, user_id, project_id, create_date, modify_date)
            extention_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "프로젝트 기간이 연장되었습니다."}, 200


    def put(self):

        params = extention.parse.parse_args()
        print("!!!!")
        print(params)

        extention_id =              request.args.get('extention_id')
        print(extention_id)
        

        extention_st_dt =     params['extention_st_dt']
        extention_ed_dt =     params['extention_ed_dt']                             
        extention_cost =      params['extention_cost']
        extention_memo =      params['extention_memo']
        project_id =      params['project_id']
 

        extention_obj = ExtentionModel.find_by_id(extention_id)

        try:
            # project_obj = ProjectModel.find_by_id(project_id)
            # project_obj.project_last_date = extention_ed_dt

            # print(int(project_obj.project_total_cost)+int(extention_cost))

            # project_obj.project_total_cost = int(project_obj.project_total_cost)+int(extention_cost)
            # project_obj.save_to_db()

            extention_obj.extention_st_dt = extention_st_dt
            extention_obj.extention_ed_dt = extention_ed_dt
            extention_obj.extention_cost = extention_cost
            extention_obj.extention_memo = extention_memo
         
            extention_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500


        return {'resultCode': '0', "resultString": "프로젝트 기간 연장이 수정되었습니다."}, 200



