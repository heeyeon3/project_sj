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
from models.notice import NoticeModel


from datetime import datetime



class notice(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('notice_id', type=str)
    parse.add_argument('notice_title', type=str)
    parse.add_argument('notice_contents', type=str)

 
    

    def get(self):

        notice_id =              request.args.get('notice_id')
    
        data = [dict(r) for r in NoticeModel.find_by_id_time(notice_id)]
     
        print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200



    def post(self):
        params = notice.parse.parse_args()
        print("!!!!")
        print(params)

        notice_title = params['notice_title']
        notice_contents = params['notice_contents']

        user_id = current_user.user_id
        create_date = datetime.now()
        modify_date = datetime.now()

        try:
            notice_obj = NoticeModel(notice_title, notice_contents, 'Y',user_id,create_date, modify_date)
                


            notice_obj.save_to_db()

      

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "공지사항이 등록되었습니다."}, 200


class noticelist(Resource):

    parse = reqparse.RequestParser()


    parse.add_argument('notice_id', type=str)
    parse.add_argument('notice_title', type=str)
    parse.add_argument('notice_contents', type=str)

 
    

    def get(self):

        # project_id =              request.args.get('project_id')
    
        data = [dict(r) for r in NoticeModel.find_by_notice_list()]
     
        print(data)

        return {'resultCode': '0', "resultString": "SUCCESS", "data":data}, 200