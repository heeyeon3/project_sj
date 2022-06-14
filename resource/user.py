from models.company import CompanyModel
from models.project import ProjectModel
from models.user import UserModel
from flask import request, render_template, redirect, url_for
from flask_restful import Resource, reqparse
from resource.company import company
from resource.project import project
from utils.jsonutil import AlchemyEncoder as jsonEncoder
from flask_login import login_user, logout_user, current_user, login_required
from resource.log import LogMessage
# from resource.group import GroupModel
from flask import g
import json
import logging
from datetime import datetime


# 사용자 로그인
class UserLogin(Resource):

    print("LOGIN FUNCTION ENTERRED !!!!! ")
    parse = reqparse.RequestParser()

    

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_pwd', type=str)
    parse.add_argument('next', type=str)
    parse.add_argument('project_id', type=str)

    def post(self):

        print("LOGIN FUNCTION post ENTERRED !!!!! ")

        params = UserLogin.parse.parse_args()
        print(params)

        user_id = params['user_id']
        user_pwd = params['user_pwd']
        next_url = params['next']
        project_id = params['project_id']

        user_obj = UserModel.find_by_id(user_id)
        print(user_id)
        print(user_pwd)

        if user_obj is None:
            print("user_obj is None")
            return {'resultCode': '100', "resultString": "등록된 사용자가 아닙니다."}, 200  # 인증실패
        else:
            print(user_obj.use_yn)
            if user_obj.use_yn == "N":
                return {'resultCode': '100', "resultString": "현재 미사용으로 등록된 사용자입니다. 상위 관리자에게 문의해주세요."}, 200  
            # 패스워드 비교
            # print(user_pwd)
            # if user_obj.check_password(user_pwd):
            if user_obj.user_pwd == user_pwd:

                # Arnold added. 최초생성 패스워드와 아이디가 동일하면 패스워드 수정하게 만든다. 무조건 !!!!
                if user_obj.check_id_pwd(user_id):
                    return {'resultCode': '101', "resultString": "패스워드와 아이디가 같습니다. 패스워드를 수정해주십시오."}, 200  # 인증실패

                conn_time = [dict(r) for r in user_obj.check_time()]
                print(conn_time)
                # 유저가 휴면 계정 해지 후 혹은 계정 작성후 첫 접속시
                if conn_time[0]['DiffDo'] == None:
                    user_obj.user_conn_date = datetime.now()


                user_obj.user_auth = True
                user_obj.user_conn_date = datetime.now()
                login_user(user_obj, remember=True)

                # 현재 로그인 사용자 업데이트
                user_obj.save_to_db()

                # 정상 로그인 로그 남기기
                LogMessage.set_message("msg_login", str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "0501")

            else:
                # 로그인 실패 로그 남기기
                LogMessage.set_login_fail_message("msg_login_fail",
                                                 str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                                                 user_id, "0501")
                return {'resultCode': '100', "resultString": "사용자 인증 실패"}, 200  # 인증실패

        if next_url is None or len(next_url) == 0:
            next_url = "/ws-01"
            
        if user_obj.user_grade == "0101":
            # next_url = "/ws-01"
            return {'resultCode': '0', "resultString": "SUCCESS", "next_url": next_url, "projectId":project_id }, 200
        else:
            # next_url = "/ws-01"
            return {'resultCode': '0', "resultString": "SUCCESS", "next_url": next_url, "projectId":project_id}, 200



# 사용자 로그아웃 처리
class UserLogout(Resource):

    @login_required
    def post(self):

        user = current_user

        user_obj = UserModel.find_by_id(user.user_id)
        user_obj.user_auth = False
        user_obj.save_to_db()

        # print("로그아웃 USER >> " + user.user_id + " : " + user.user_grade + ":" + str(user.user_auth))

        # 로그 남기기
        LogMessage.set_message("msg_logout", str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "0501")

        logout_user()
        return {'resultCode': '0', "resultString": "로그아웃 되었습니다."}, 200


# 사용자 비밀번호 찾기
class UserPwFind(Resource):
    parse = reqparse.RequestParser()

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_nm', type=str)
    parse.add_argument('user_dept_nm', type=str)
    parse.add_argument('user_new_pwd', type=str)

    def post(self):
        # Searching Password with ID, name, department
        print("***PW FIND POST****")

        params = User.parse.parse_args()

        user_id = params['user_id']
        user_nm = params['user_nm']
        user_dept_nm = params['user_dept_nm']             
        found_password = UserModel.get_password(user_id, user_nm, user_dept_nm)
        final_list = [{
            'user_pwd': row[0],

        } for row in found_password]

        found_password = json.dumps(final_list, cls=jsonEncoder)
        print(type(final_list[0]))
        print(final_list[0]['user_pwd'])

    def put(self, user_id_verify):
        params = UserPwFind.parse.parse_args()
        user_pwd = params['user_new_pwd']

        try:
            user_obj = UserModel.find_by_id(user_id_verify)
            user_obj.set_password(user_pwd)
            user_obj.user_pwd_change_dt = datetime.now()
            user_obj.mdfy_dt = datetime.now()
            user_obj.save_to_db()
        except Exception as e:
            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": user_id_verify + " 사용자 정보가 수정 되었습니다."}, 200



# 사용자 (조회/등록/수정/삭제)
class User(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_pwd', type=str)
    parse.add_argument('user_nm', type=str)
    parse.add_argument('user_grade', type=str)
    parse.add_argument('user_phone', type=str)
    parse.add_argument('user_birth', type=str)
    parse.add_argument('user_point', type=str)               
    parse.add_argument('user_office', type=str)             
    parse.add_argument('user_dept_nm', type=str)
    parse.add_argument('user_dept_charge', type=str)
    parse.add_argument('user_conn_date', type=str)                
    parse.add_argument('user_dor_acc', type=str)                
    parse.add_argument('user_pwd_change_dt', type=str)                
    parse.add_argument('use_yn', type=str)

    def get(self):
        # User configuration register !!

        print("USER GET ENTERED !!!")
        params = User.parse.parse_args()

        user_id = params['user_id']
        user_nm = params['user_nm']
        user_grade = params['user_grade']

        try:
            userObj = UserModel.find_by_id(user_id)
            
        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": " 사용자 설정정보가 설정 되었습니다."}, 200

    def post(self):
        print("USER POST ENTERED !!!")
        params = User.parse.parse_args()

        user_id = params['user_id']
        user_pwd = params['user_pwd']
        user_nm = params['user_nm']
        user_phone = params['user_phone']
        user_birth = params['user_birth']
        user_point = params['user_point']
        user_office = params['user_office']
        user_dept_nm = params['user_dept_nm']
        user_dept_charge = params['user_dept_charge']
        
        user_obj = UserModel.find_by_id(user_id)

        if user_obj:
            return {'resultCode': '100', "resultString": "이미 등록된 아이디 입니다."}, 200

        user_grade = "0103"
        create_date =    datetime.now()
        modify_date =   datetime.now()

        try:
            # user_id, user_pwd, user_nm, user_grade, user_phone, user_birth, user_point, user_office, user_dept_nm, user_dept_charge, create_date, modify_date
            user_obj = UserModel(user_id, user_pwd, user_nm, user_grade, user_phone, user_birth, user_point, user_office, user_dept_nm, user_dept_charge, create_date, modify_date)
         
            user_obj.save_to_db()

        except Exception as e:

            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": user_nm + " 사용자가 등록 되었습니다."}, 200

    def put(self):
        print("USER PUT ENTERED !!!")
        params = User.parse.parse_args()

        user_id = params['user_id']
        user_pwd = params['user_pwd']
        user_nm = params['user_nm']
        user_phone = params['user_phone']
        user_birth = params['user_birth']
        user_point = params['user_point']
        user_office = params['user_office']
        user_dept_nm = params['user_dept_nm']
        user_dept_charge = params['user_dept_charge']


        try:
            user_obj = UserModel.find_by_id(user_id)
            # user_obj.set_password(user_pwd)
            user_obj.user_pwd = user_pwd
            # user_obj.user_nm = user_nm
            # user_obj.user_phone = user_phone
            # user_obj.user_birth = user_birth
            # user_obj.user_office = user_office
            # user_obj.user_dept_nm = user_dept_nm
            # user_obj.user_dept_charge = user_dept_charge
            user_obj.user_pwd_change_dt = datetime.now()
            user_obj.modify_date = datetime.now()
            user_obj.save_to_db()

        except Exception as e:
            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "FAIL"}, 500

        return {'resultCode': '0', "resultString": "사용자 정보가 수정 되었습니다."}, 200

    def  delete(self, user_id):

        try:
            user_obj = UserModel.find_by_id(user_id)
            if user_obj.use_yn == 'Y':
                user_obj.use_yn = 'N'
            else:
                user_obj.use_yn = 'Y'

            user_obj.save_to_db()
        except Exception as e:
            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": "사용유무 변경 시 에러가 발생했습니다."}, 500

        return {'resultCode': '0', "resultString": "사용유무가 변경 되었습니다."}, 200


# 사용자 메인 및 검색 조회
class UserSearch(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_pwd', type=str)
    parse.add_argument('user_nm', type=str)
    parse.add_argument('user_grade', type=str)
    parse.add_argument('group_seq', type=str)
    parse.add_argument('start', type=str)
    parse.add_argument('length', type=str)

    def get(self):

        params = UserSearch.parse.parse_args()

        user_grade = params['user_grade'].split(",")
        # user_grade.split에서 tuple을 제대로 인식못해서 잠시 롤백
        # user_list = json.dumps([dict(r) for r in UserModel.get_user_code(user_grade)], default=jsonEncoder)
        try:
            guser = current_user.user_id
            
        except Exception as e:
            return 200

        

        user_list = UserModel.get_user_code(user_grade)
        print(user_grade)
        sum_user_settop = 0
        sum_user_disk = 0


        final_list = [{
            'user_id': row[0],
            'user_nm': row[1],
            'user_grade_nm': row[2],
        } for row in user_list]

        user_list = json.dumps(final_list, cls=jsonEncoder)
        
        ret_value = {
                     "resultCode": "0",
                     "resultString": "SUCCESS",
                     "resultUserid":  guser,
                     "resultUserGroup": current_user.user_grade,
                     "data": user_list
        }

        return ret_value, 200

    def post(self):
        res_data = {}

        params = UserSearch.parse.parse_args()

        user_id = params['user_id']
        user_nm = params['user_nm']
        user_grade = params['user_grade']
        group_seq = params['group_seq']
        start = params['start']
        length = params['length']

        print(params)
        # if(current_user.user_grade == '0103'): #담당자인 경우
        #     group_seq = int(current_user.group_seq)
        #     create_user_id = current_user.user_id
        # else:
        #     group_seq = 0 #어드민인 경우
        #     create_user_id = current_user.user_id
        
        # 사용자 Total Count
        param = (user_id, user_nm, user_grade, group_seq)
        tot_list = [dict(r) for r in UserModel.find_all_user_count(param)]

        res_data['recordsTotal'] = tot_list[0]['tot_cnt']
        res_data['recordsFiltered'] = tot_list[0]['tot_cnt']

        ###################################################################

        # 페이징 데이터 조회 처리
        if(length == None):
            length = "0" 
        param = (user_id, user_nm, user_grade, start, length)

        res_data['data'] = [dict(r) for r in UserModel.find_all_user(param)]
        
        print(res_data['data'])
        
        # 응답 결과
        res_data['resultCode'] = "0"
        res_data['resultString'] = "SUCCESS"


        return res_data, 200



    


class UserDormancy(Resource):
    parse = reqparse.RequestParser()

    # print("Request comes here..")


    def put(self, user_id):
        # print(user_id)
        try:
            user_obj = UserModel.find_by_id(user_id)

            # 휴면 해지 코드 삽입 예정 (ARNOLD UPDATE)
            user_obj.user_dor_acc = 'N'
            user_obj.mdfy_dt = datetime.now()

            user_obj.save_to_db()

        except Exception as e:
            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": user_id + " 계정의 휴면 상태 해지에 실패하였습니다."}, 500

        return {'resultCode': '0', "resultString": user_id + " 계정의 휴면 상태가 해제되었습니다."}, 200


class UserPassword(Resource):
    parse = reqparse.RequestParser()
    parse.add_argument('user_pwd', type=str)

    def put(self, user_id):

        params = UserPassword.parse.parse_args()
        user_pwd = params['user_pwd']

        # print("ID:"+user_id+" PWD:"+user_pwd)


        try:
            user_obj = UserModel.find_by_id(user_id)
            user_obj.set_password(user_pwd)
            print("!@#$user_obj")
            print(user_obj)
            user_obj.user_pwd_change_dt = datetime.now()
            user_obj.mdfy_dt = datetime.now()
            print("!@#$user_obj")
            print(user_obj)
            user_obj.save_to_db()

        except Exception as e:
            logging.fatal(e, exc_info=True)
            return {'resultCode': '100', "resultString": user_id + " 계정의 패스워드 변경이 실패하였습니다."}, 500

        return {'resultCode': '0', "resultString": user_id + " 계정의 패스워드 변경이 성공하였습니다."}, 200

class UserDuplicate(Resource):
    parse = reqparse.RequestParser()

    def get(self, user_id):
        user_obj = UserModel.find_by_id(user_id)
        if user_obj:
            return {'result': True}
        else:
            return {'result': False}





# 프


# 사용자 (조회/등록/수정/삭제)
class ProjectUser(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('ManagementId', type=str)
    parse.add_argument('ManagementPwd', type=str)
    parse.add_argument('MonitoringId', type=str)
    parse.add_argument('MonitoringPwd', type=str)
    parse.add_argument('project_id', type=str)

    def get(self):
        project_id =              request.args.get('project_id')

        if(project_id == "null") :
            return {'resultCode': '0', "resultString": "프로젝트 사용자 조회에 성공하셨습니다.", "data" : None} 

        data = [dict(r) for r in UserModel.find_by_project_id(project_id)]

        return {'resultCode': '0', "resultString": "프로젝트 사용자 조회에 성공하셨습니다.", "data": data}


    def post(self):
        print("USER POST ENTERED !!!")
        params = ProjectUser.parse.parse_args()
        
        print(params)

        ManagementId = params['ManagementId']
        ManagementPwd = params['ManagementPwd']
        MonitoringId = params['MonitoringId']
        MonitoringPwd = params['MonitoringPwd']
        project_id = params['project_id']


        user_obj = [dict(r) for r in UserModel.find_by_project_id(project_id)]
        # Management_user_obj = [dict(r) for r in UserModel.find_by_project_id(project_id)]

        # company_id = CompanyModel.find_by_project_id(project_id).company_id
        create_date = datetime.now()
        modify_date = datetime.now()

        print(user_obj)

        if(len(user_obj) == 0 ):
            management_user = UserModel.find_by_id(ManagementId)
            monitoring_user = UserModel.find_by_id(MonitoringId)

            if(management_user):

                return {'resultCode': '0', "resultString": "중복된 아이디입니다."}, 200

            elif(monitoring_user):
                return {'resultCode': '0', "resultString": "중복된 아이디입니다."}, 200

            else:

                try:

                    project_obj = ProjectModel.find_by_id(project_id)
                    company_id = project_obj.company_id
                    company_name = project_obj.project_name
                    # user_id, user_pwd, user_nm, user_grade, user_phone, user_birth, user_point, user_office, user_dept_nm, user_dept_charge, create_date, modify_date
                    management_user_obj = UserModel(ManagementId, ManagementPwd, company_name, '0103', create_date, 'Y', company_id, project_id, create_date, modify_date)
                    monitoring_user_obj = UserModel(MonitoringId, MonitoringPwd, company_name, '0104', create_date, 'Y', company_id, project_id, create_date, modify_date)
                
                    management_user_obj.save_to_db()
                    monitoring_user_obj.save_to_db()

                except Exception as e:

                    logging.fatal(e, exc_info=True)
                    return {'resultCode': '100', "resultString": "FAIL"}, 500

                return {'resultCode': '0', "resultString":  " 사용자가 등록 되었습니다."}, 200

        else:
          

            try:

                management_user = UserModel.find_by_id(ManagementId)
                monitoring_user = UserModel.find_by_id(MonitoringId)

                management_user.user_pwd = ManagementPwd
                management_user.modify_date = modify_date
                monitoring_user.user_pwd = MonitoringPwd
                monitoring_user.modify_date = modify_date

                management_user.save_to_db()
                monitoring_user.save_to_db()

            except Exception as e:

                logging.fatal(e, exc_info=True)
                return {'resultCode': '100', "resultString": "FAIL"}, 500

            return {'resultCode': '0', "resultString":  " 사용자가 등록 되었습니다."}, 200



class passwardcheck(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('password', type=str)
    parse.add_argument('ManagementPwd', type=str)
    parse.add_argument('MonitoringId', type=str)
    parse.add_argument('MonitoringPwd', type=str)
    parse.add_argument('project_id', type=str)

    

    def post(self):
        print("USER POST ENTERED !!!")
        params = passwardcheck.parse.parse_args()
        
        print(params)

        password = params['password']
        user_id = current_user.user_id
      
        user_obj = UserModel.find_by_id(user_id)

        # if user_obj.check_password(password):
        if user_obj.user_pwd == password:
            # next_url = "ws-10-9-1"
            
            return {'resultCode': '0', "resultString": "SUCCESS"}, 200
            

        else:
            
            return {'resultCode': '100', "resultString": "비밀번호가 올바르지 않습니다."}, 200  # 인증실패



class currentuser_check(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('password', type=str)
    parse.add_argument('ManagementPwd', type=str)
    parse.add_argument('MonitoringId', type=str)
    parse.add_argument('MonitoringPwd', type=str)
    parse.add_argument('project_id', type=str)

    

    def post(self):
        print("current user!!")
        user_id = current_user.user_id
        user_obj = json.dumps(UserModel.find_by_id(user_id), cls=jsonEncoder)
            
        return {'resultCode': '100', "resultString": "currentuser","data":user_obj}, 200  # 인증실패
            
        

# Back office 사용자 로그인
class BoUserLogin(Resource):

    print("BO LOGIN FUNCTION ENTERRED !!!!! ")
    parse = reqparse.RequestParser()

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_pwd', type=str)
    parse.add_argument('next', type=str)
    parse.add_argument('project_id', type=str)

    def post(self):

        print("LOGIN FUNCTION post ENTERRED !!!!! ")

        params = UserLogin.parse.parse_args()
        print(params)

        user_id = params['user_id']
        user_pwd = params['user_pwd']
        next_url = params['next']
        project_id = params['project_id']

        user_obj = UserModel.find_by_id(user_id)
        print(user_id)
        print(user_pwd)

        if user_obj is None:
            print("user_obj is None")
            return {'resultCode': '100', "resultString": "등록된 사용자가 아닙니다."}, 200  # 인증실패
        else:
            print(user_obj.use_yn)
            if user_obj.use_yn == "N":
                return {'resultCode': '100', "resultString": "현재 미사용으로 등록된 사용자입니다. 상위 관리자에게 문의해주세요."}, 200  
            # 패스워드 비교
            # print(user_pwd)
            

            if user_obj.user_pwd == user_pwd:
                if user_obj.user_grade != '0101' :
                    return {'resultCode': '100', "resultString": "로그인 권한이 없습니다."}, 200
                    
                # Arnold added. 최초생성 패스워드와 아이디가 동일하면 패스워드 수정하게 만든다. 무조건 !!!!
                if user_obj.check_id_pwd(user_id):
                    return {'resultCode': '101', "resultString": "패스워드와 아이디가 같습니다. 패스워드를 수정해주십시오."}, 200  # 인증실패

                conn_time = [dict(r) for r in user_obj.check_time()]
                print(conn_time)
                # 유저가 휴면 계정 해지 후 혹은 계정 작성후 첫 접속시
                if conn_time[0]['DiffDo'] == None:
                    user_obj.user_conn_date = datetime.now()


                user_obj.user_auth = True
                user_obj.user_conn_date = datetime.now()
                login_user(user_obj, remember=True)

                # 현재 로그인 사용자 업데이트
                user_obj.save_to_db()

                # 정상 로그인 로그 남기기
                LogMessage.set_message("msg_login", str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "0501")

            else:
                # 로그인 실패 로그 남기기
                LogMessage.set_login_fail_message("msg_login_fail",
                                                 str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                                                 user_id, "0501")
                return {'resultCode': '100', "resultString": "사용자 인증 실패"}, 200  # 인증실패
            
        if user_obj.user_grade == "0101":
            next_url = "/bo-02"
            return {'resultCode': '0', "resultString": "SUCCESS", "next_url": next_url, "projectId":project_id }, 200

# Back office 사용자 로그인
class AppUserLogin(Resource):

    parse = reqparse.RequestParser()

    parse.add_argument('user_id', type=str)
    parse.add_argument('user_pwd', type=str)
    parse.add_argument('project_id', type=str)

    def post(self):

        print("App LOGIN FUNCTION post ENTERRED !!!!! ")

        params = AppUserLogin.parse.parse_args()
        print(params)

        user_id = params['user_id']
        user_pwd = params['user_pwd']
        project_id = params['project_id']

        user_obj = UserModel.find_by_id(user_id)
        print(user_id)
        print(user_pwd)

        if user_obj is None:
            print("user_obj is None")
            return {'resultCode': '100', "resultString": "등록된 사용자가 아닙니다."}, 200  # 인증실패
        else:
            print(user_obj.use_yn)
            if user_obj.use_yn == "N":
                return {'resultCode': '100', "resultString": "현재 미사용으로 등록된 사용자입니다. 상위 관리자에게 문의해주세요."}, 200  
            # 패스워드 비교
            if user_obj.user_pwd == user_pwd:
                conn_time = [dict(r) for r in user_obj.check_time()]
                print(conn_time)
                # 유저가 휴면 계정 해지 후 혹은 계정 작성후 첫 접속시
                if conn_time[0]['DiffDo'] == None:
                    user_obj.user_conn_date = datetime.now()


                user_obj.user_auth = True
                user_obj.user_conn_date = datetime.now()
                login_user(user_obj, remember=True)
                
                company_list = [dict(r) for r in CompanyModel.find_company_by_user_id(user_id, user_obj.user_grade)]
                
                # 현재 로그인 사용자 업데이트
                user_obj.save_to_db()

                # 정상 로그인 로그 남기기
                LogMessage.set_message("msg_login", str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')), "0501")

            else:
                # 로그인 실패 로그 남기기
                LogMessage.set_login_fail_message("msg_login_fail",
                                                 str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')),
                                                 user_id, "0501")
                return {'resultCode': '100', "resultString": "사용자 인증 실패"}, 200  # 인증실패
            
        return {'resultCode': '0', "resultString": "SUCCESS", "company" : company_list, "user_id" :  user_id}, 200