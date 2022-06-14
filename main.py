#-*- coding:utf-8 -*-

from distutils import extension
import resource
from tokenize import endpats
from core.db import db
from flask_restful import Api
from flask import Flask, session, render_template, jsonify
from flask_jwt_extended import JWTManager
from config.configuration import Configuration
from dateutil.relativedelta import *
import datetime

from datetime           import timedelta
from apscheduler.schedulers.background import BackgroundScheduler

from flask_login        import LoginManager, login_required

from resource.user      import BoUserLogin, AppUserLogin, User, UserLogin, UserLogout, UserPwFind, UserSearch, UserPassword, UserDuplicate, UserDormancy, UserModel, ProjectUser, passwardcheck, currentuser_check
from resource.code      import Code, CodeSearch, CodeApplySearch
from resource.datarogger import Datarogger, DataloggerList, DataloggerListProject
from resource.company import company, companylist
from resource.project import project, projectlist, projectlistWs, projectlocation, currentproject, projectfloorplan, projectcostexceldown
from resource.extention import extention
from resource.servicecenter import servicecenter, servicesenterlist, servicecenteranswer, servicecentercount
from resource.sensor import sensor, sensorleftmenu, all_sensor_setting, SensorlistGroup
from resource.rawdata import rawdataSensorlist, rawdatagraph, exceldownOrigin, exceldownscatterorigin
from resource.editdata import Editdata, editdatatable, editdatatableall, exceldown, exceldownAll, exceldownRecord, excelupload, editdatatableallgraph, editdataroadcell, exceldownscatter,editdatatableallline, editdatauseyn
from resource.place import Place
from resource.sensorgroup import Sensorgroup, Sensorgroupmapping, Sensorgroupmodal
from resource.sensordetail import SensordetailList, Sensordetail, Sensordetailmodal, Sensorinitialmodal, sensorlistexceldown, fumulalistsensor, Sensordetailmodalscatter, Sensorinitialmodalscatter, Sensorgaugemodalscatter, Sensordetailall
from resource.notice import notice, noticelist
from resource.function import FunctionFormula, FormulaProject, FunctionFormulaCheck, Formularoadcell, raoadcellfunction, FunctionFormulaCompany
from resource.floorplan import Floorplan
from resource.alarm import alarm, alarmbo
from resource.weather import weather, weatherdata
from resource.dataroggerupload import dataroggerUpload
from resource.notimanager import notimanager, notimanagerall
from resource.alarmpost import alarmpost

# Flask Init App
app = Flask(__name__)


# SQLITE and secret Config
app.config.from_object(Configuration)
# app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(minutes=30)
# app.config["REMEMBER_COOKIE_DURATION"] = timedelta(minutes=30)
# app.config['SQLALCHEMY_POOL_RECYCLE'] = <db_wait_timeout> - 1
app.config['SQLALCHEMY_POOL_RECYCLE'] = 499
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20


# JWT Set
jwt = JWTManager(app)

# APP Set
api = Api(app)

# DataBase Init
db.init_app(app)

# DB Table creation test.
with app.app_context():
    db.create_all()
    # print("NEW DB Tables created (Not exist only created !!)")

# Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "/"
login_manager.needs_refresh_message = (u"Session timedout, please re-login")
login_manager.needs_refresh_message_category = "info"

@app.before_request
def before_request():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=300)
    app.config["REMEMBER_COOKIE_DURATION"] = timedelta(minutes=300)

@login_manager.user_loader
def user_loader(user_id):
    return UserModel.find_by_id(user_id)


# ######################################################################################################################
# INTRO PAGE and LOGIN API 모음
# ######################################################################################################################
@app.route('/')
def main():
        return  render_template('/ws/ws-00-1.html')

api.add_resource(UserLogin,     '/web/login', endpoint='web/login')                                 # Workspace 로그인 분기
api.add_resource(BoUserLogin,   '/web/bologin', endpoint='web/bologin')                             # Back 로그인 분기 
api.add_resource(AppUserLogin,  '/app/login', endpoint='app/login')
api.add_resource(UserLogout,    '/web/logout', endpoint='web/logout')                               # CMS 로그아웃  method:post
api.add_resource(UserPwFind,    '/user/find', endpoint='user/find')                                 # 비밀번호 검증 method:post
api.add_resource(UserPwFind,    '/user/resetPw/<string:user_id_verify>', endpoint='user/resetPw')
api.add_resource(User,    '/user/change', endpoint='user/change')

# ######################################################################################################################
# Workspace 모음
# ######################################################################################################################
@app.route('/ws-01')
@login_required
def workspace_main():
        return  render_template('/ws/ws-01.html')

api.add_resource(projectlistWs,     '/project/list/ws', endpoint='project/list/ws')  
api.add_resource(currentuser_check,     '/current/user', endpoint='current/user')  


@app.route('/ws-00')
@login_required
def project_login():
        return  render_template('/ws/ws-00.html')


# ######################################################################################################################
# Workspace Project Chart 모음
# ######################################################################################################################

@app.route('/ws-02')
@login_required
def project_main():
        return  render_template('/ws/ws-02.html')
api.add_resource(sensorleftmenu,     '/sensor/leftmenu', endpoint='sensor/leftmenu')  
api.add_resource(Floorplan,     '/floorplan/mapdata', endpoint='/floorplan/mapdata')

@app.route('/ws-02-1-1')
@login_required
def project_All_chart_X():
        return  render_template('/ws/ws-02-1-1.html')


api.add_resource(Sensordetailmodal,     '/sensordetail/guidline', endpoint='sensordetail/guidline')
api.add_resource(Sensordetailmodalscatter,     '/sensordetail/guidline/scatter', endpoint='sensordetail/guidline/scatter')
api.add_resource(rawdatagraph,     '/rawdata/graph', endpoint='rawdata/graph')
api.add_resource(editdatatable,     '/editdata/table', endpoint='editdata/table')
api.add_resource(Sensorgroupmodal,     '/sensorgroup/guidline', endpoint='sensorgroup/guidline') 


 

@app.route('/ws-02-1-2')
@login_required
def project_All_chart_Y():
        return  render_template('/ws/ws-02-1-2.html')

@app.route('/ws-02-1-7')
@login_required
def project_All_chart_Scatter():
        return  render_template('/ws/ws-02-1-7.html')

@app.route('/ws-02-1-8')
@login_required
def project_All_chart_LoadCell():
        return  render_template('/ws/ws-02-1-8.html')

@app.route('/ws-02-1-3')
@login_required
def project_All_trendchart_X():
        return  render_template('/ws/ws-02-1-3.html')

@app.route('/ws-02-1-4')
@login_required
def project_All_trendchart_Y():
        return  render_template('/ws/ws-02-1-4.html')

@app.route('/ws-02-1-9')
@login_required
def project_All_timelinechart():
        return  render_template('/ws/ws-02-1-9.html')

api.add_resource(weatherdata, '/weather/data', endpoint = 'weather/data')

@app.route('/ws-02-1-9-1')
@login_required
def project_All_timelinechart_scatter():
        return  render_template('/ws/ws-02-1-9-1.html')

@app.route('/ws-02-1-5')
@login_required
def project_All_linechart_data():
        return  render_template('/ws/ws-02-1-5.html')

api.add_resource(editdatatableall,     '/editdata/all', endpoint='/editdata/all')
api.add_resource(editdatatableallgraph,     '/editdata/all/graph', endpoint='/editdata/all/graph')
api.add_resource(editdataroadcell,     '/editdata/all/roadcell', endpoint='/editdata/all/roadcell')
api.add_resource(editdatatableallline,     '/editdata/all/line', endpoint='/editdata/all/line')

@app.route('/ws-02-1-10')
@login_required
def project_All_scatter_data():
        return  render_template('/ws/ws-02-1-10.html')

@app.route('/ws-02-1-11')
@login_required
def project_All_loadcell_data():
        return  render_template('/ws/ws-02-1-11.html')

@app.route('/ws-02-1-13')
@login_required
def roadcell_all_graph():
        return  render_template('/ws/ws-02-1-13.html')

@app.route('/ws-02-1-14')
@login_required
def roadcell_all_trend():
        return  render_template('/ws/ws-02-1-14.html')

@app.route('/ws-02-1-15')
@login_required
def roadcell_all_data():
        return  render_template('/ws/ws-02-1-15.html')
        
@app.route('/ws-02-1-16')
@login_required
def roadcell_all_formula():
        return  render_template('/ws/ws-02-1-16.html')

@app.route('/ws-02-1-17')
@login_required
def roadcell_all_info():
        return  render_template('/ws/ws-02-1-17.html')

@app.route('/ws-02-1-5-1')
@login_required
def independent_all_data():
        return  render_template('/ws/ws-02-1-5-1.html')

@app.route('/ws-02-1-6')
@login_required
def project_All_chart_Info():
        return  render_template('/ws/ws-02-1-6.html')

@app.route('/ws-02-1-6-2')
@login_required
def independent_All_chart_Info():
        return  render_template('/ws/ws-02-1-6-2.html')

@app.route('/ws-02-2-4-1')
@login_required
def scatter_fomula():
        return  render_template('/ws/ws-02-2-4-1.html')

api.add_resource(Sensorgroupmapping,     '/sensorgroup/mapping', endpoint='/sensorgroup/mapping') 

@app.route('/ws-02-1-6-1')
@login_required
def project_All_chart_Info_scatter():
        return  render_template('/ws/ws-02-1-6-1.html')

@app.route('/ws-02-2-1')
@login_required
def sensor_chart_x():
        return  render_template('/ws/ws-02-2-1.html')
api.add_resource(Sensorinitialmodal,     '/sensordetail/initial', endpoint='sensordetail/initial') 
api.add_resource(Sensorinitialmodalscatter,     '/sensordetail/initial/scatter', endpoint='sensordetail/initial/scatter') 
api.add_resource(fumulalistsensor,     '/fumula/list/sensor', endpoint='fumula/list/sensor') 

@app.route('/ws-02-2-3')
@login_required
def sensor_data():
        return  render_template('/ws/ws-02-2-3.html')

api.add_resource(Editdata,     '/editdata', endpoint='/editdata')
api.add_resource(exceldown,     '/excel/down', endpoint='excel/down') 
api.add_resource(exceldownAll,     '/excel/down/all', endpoint='excel/down/all') 
api.add_resource(exceldownOrigin,     '/excel/down/origin', endpoint='excel/down/origin') 
api.add_resource(exceldownRecord,     '/excel/down/record', endpoint='excel/down/record') 
api.add_resource(exceldownscatter,     '/excel/down/scatter', endpoint='excel/down/scatter') 
api.add_resource(exceldownscatterorigin,     '/excel/down/scatter/origin', endpoint='excel/down/scatter/origin') 

api.add_resource(excelupload,     '/data/upload', endpoint='/data/upload') 
api.add_resource(editdatauseyn,     '/editdata/delete', endpoint='/editdata/delete') 


@app.route('/ws-02-2-4')
@login_required
def sensor_function():
        return  render_template('/ws/ws-02-2-4.html')

@app.route('/ws-02-2-5')
@login_required
def sensor_detail():
        return  render_template('/ws/ws-02-2-5.html')

@app.route('/ws-02-2-6')
@login_required
def sensor_chart_scatter():
        return  render_template('/ws/ws-02-2-6.html')

@app.route('/ws-02-2-7')
@login_required
def sensor_trend_scatter():
        return  render_template('/ws/ws-02-2-7.html')

@app.route('/ws-02-2-7-1')
@login_required
def sensor_trend_scatter_all():
        return  render_template('/ws/ws-02-2-7-1.html')

@app.route('/ws-02-2-8')
@login_required
def sensor_scatter_data():
        return  render_template('/ws/ws-02-2-8.html')

@app.route('/ws-02-2-9')
@login_required
def sensor_datail():
        return  render_template('/ws/ws-02-2-9.html')
api.add_resource(Sensorgaugemodalscatter,     '/sensor/gauge/scatter', endpoint='sensor/gauge/scatter') 

@app.route('/ws-03')
@login_required
def function_set():
        return  render_template('/ws/ws-03.html')

api.add_resource(FormulaProject,     '/fomula/list/project', endpoint='fomula/list/project') 
api.add_resource(FunctionFormulaCompany,     '/function_formula/company', endpoint='/function_formula/company') 

@app.route('/ws-04')
@login_required
def cunstomer_center():
        return  render_template('/ws/ws-04.html')

api.add_resource(servicecenter,     '/servicecenter/inquiry', endpoint='/servicecenter/inquiry') 
api.add_resource(servicesenterlist,     '/servicecenter/list', endpoint='/servicecenter/list') 

@app.route('/ws-04-1')
@login_required
def cunstomer_center_answer():
        return  render_template('/ws/ws-04-1.html')

@app.route('/ws-04-2')
@login_required
def cunstomer_center_add():
        return  render_template('/ws/ws-04-2.html')

@app.route('/ws-05')
@login_required
def notice01():
        return  render_template('/ws/ws-05.html')

@app.route('/ws-05-1')
@login_required
def notice_detail():
        return  render_template('/ws/ws-05-1.html')



# ######################################################################################################################
# Workspace Setting 모음
# ######################################################################################################################
@app.route('/ws-10')
@login_required
def project_setting():
        return  render_template('/ws/ws-10.html')
  
api.add_resource(projectlocation,     '/project/location', endpoint='project/location') 
api.add_resource(currentproject,     '/project/current', endpoint='project/current') 
api.add_resource(DataloggerListProject,     '/datarogger/list', endpoint='datarogger/list') 


@app.route('/ws-10-1')
@login_required
def project_set_location():
        return  render_template('/ws/ws-10-1.html')

@app.route('/ws-10-2')
@login_required
def project_datalogger():
        return  render_template('/ws/ws-10-2.html')

api.add_resource(Datarogger,     '/api/datarogger', endpoint='/api/datarogger')                               
api.add_resource(DataloggerList,     '/datalogger/list', endpoint='/datalogger/list')                                 
api.add_resource(sensor,     '/sensor/list', endpoint='/sensor/list')                        
api.add_resource(rawdataSensorlist,     '/datalogger/sensor/list', endpoint='datalogger/sensor/list')                                
api.add_resource(SensorlistGroup,     '/sensorgroup/sensor/list', endpoint='sensorgroup/sensor/list')                                

@app.route('/ws-10-3')
@login_required
def project_floorplan():
        return  render_template('/ws/ws-10-3.html')

api.add_resource(projectfloorplan,     '/project/floorplan', endpoint='/project/floorplan') 

@app.route('/ws-10-4')
@login_required
def project_installation_group():
        return  render_template('/ws/ws-10-4.html')


api.add_resource(Place,     '/place/list', endpoint='place/list') 

@app.route('/ws-10-5')
@login_required
def project_sencer_group():
        return  render_template('/ws/ws-10-5.html')

api.add_resource(Sensorgroup,     '/sensorgroup/list', endpoint='sensorgroup/list') 

@app.route('/ws-10-6')
@login_required
def project_sencer():
        return  render_template('/ws/ws-10-6.html')

api.add_resource(SensordetailList,     '/sensordetail/list', endpoint='sensordetail/list') 
api.add_resource(all_sensor_setting,     '/sensor/setting/all', endpoint='sensor/setting/all') 
api.add_resource(sensorlistexceldown,     '/sensorlist/excel/down', endpoint='sensorlist/excel/down')  


@app.route('/ws-10-6-1')
@login_required
def project_sencer_edit():
        return  render_template('/ws/ws-10-6-1.html')
api.add_resource(Sensordetail,     '/sensordetail/select', endpoint='sensordetail/select')  
api.add_resource(Sensordetailall,     '/sensordetail/select/all', endpoint='sensordetail/select/all')  


@app.route('/ws-10-7')
@login_required
def project_formula():
        return  render_template('/ws/ws-10-7.html')

@app.route('/ws-10-8')
@login_required
def project_manager_notice():
        return  render_template('/ws/ws-10-8.html')

@app.route('/ws-10-9')
@login_required
def project_manager():
        return  render_template('/ws/ws-10-9.html')
api.add_resource(passwardcheck,     '/passward/check', endpoint='passward/check')

@app.route('/ws-10-9-1')
@login_required
def project_manager_set():
        return  render_template('/ws/ws-10-9-1.html')

api.add_resource(ProjectUser,     '/project/user', endpoint='/project/user')   


api.add_resource(notimanager,     '/notimanager/add', endpoint='notimanager/add')
api.add_resource(notimanagerall,     '/notimanager/all', endpoint='notimanager/all')


@app.route('/report_scatter')
@login_required
def report_scatter():
        return  render_template('/ws/report_scatter.html')

@app.route('/report_other')
@login_required
def report_other():
        return  render_template('/ws/report_other.html')

@app.route('/report_scatter_all')
@login_required
def report_scatter_all():
        return  render_template('/ws/report_scatter_all.html')

@app.route('/report_other_all')
@login_required
def report_other_all():
        return  render_template('/ws/report_other_all.html')


@app.route('/report_roadcell_all')
@login_required
def report_roadcell_all():
        return  render_template('/ws/report_roadcell_all.html')

@app.route('/report_independent_all')
@login_required
def report_independent_all():
        return  render_template('/ws/report_independent_all.html')

  

# ######################################################################################################################
# BACKOFFICE PAGE 모음
# ######################################################################################################################
@app.route('/bo-00')
def backoffice_sensor_alarm():
        return  render_template('/bo/bo-00.html')
api.add_resource(alarmbo,     '/alarm/bo', endpoint='/alarm/bo') 

@app.route('/bo-01')
def backoffice():
        return  render_template('/bo/bo-01.html')

api.add_resource(servicecentercount,     '/servicecenter/count', endpoint='/servicescenter/count') 

# ######################################################################################################################
# BACKOFFICE PAGE 모음
# ######################################################################################################################
@app.route('/bo-02')
@login_required
def backoffice_main():
        return  render_template('/bo/bo-02.html')

# ######################################################################################################################
# BACKOFFICE - 고객사 관리 모음
# ######################################################################################################################
@app.route('/bo-03')
@login_required
def backoffice_bo03():
        return  render_template('/bo/bo-03.html')

api.add_resource(companylist,     '/company/list', endpoint='/company/list')  

@app.route('/bo-03-1')
@login_required
def backoffice_bo03_1():
        return  render_template('/bo/bo-03-1.html')

@app.route('/bo-03-1-1')
@login_required
def backoffice_bo03_1_1():
        return  render_template('/bo/bo-03-1-1.html')

api.add_resource(projectlist,     '/project/list', endpoint='/project/list')  
api.add_resource(extention,     '/extention', endpoint='/extention')  

@app.route('/bo-03-1-2')
@login_required
def backoffice_bo03_1_2():
        return  render_template('/bo/bo-03-1-2.html')

api.add_resource(project, '/project', endpoint='/project')


@app.route('/bo-03-2')
@login_required
def backoffice_bo03_2():
        return  render_template('/bo/bo-03-2.html')

api.add_resource(company,     '/company', endpoint='/company')      

# ######################################################################################################################
# BACKOFFICE - 매출현황 모음
# ######################################################################################################################
@app.route('/bo-04')
@login_required
def backoffice_bo04():
        return  render_template('/bo/bo-04.html')
api.add_resource(projectcostexceldown,     '/project/cost/list', endpoint='project/cost/list') 

# ######################################################################################################################
# BACKOFFICE - 알림 모음
# ######################################################################################################################
@app.route('/bo-05')
@login_required
def backoffice_bo05():
        return  render_template('/bo/bo-05.html')

api.add_resource(alarm,     '/alarm/all', endpoint='alarm/all') 

@app.route('/bo-05-1')
@login_required
def backoffice_bo05_1():
        return  render_template('/bo/bo-05-1.html')


# ######################################################################################################################
# BACKOFFICE - 고객센터 모음
# ######################################################################################################################
@app.route('/bo-06')
@login_required
def backoffice_bo06():
        return  render_template('/bo/bo-06.html')

api.add_resource(servicecenteranswer,     '/servicecenter/inquiry/bo', endpoint='/servicecenter/inquiry/bo') 


@app.route('/bo-06-1')
@login_required
def backoffice_bo06_1():
        return  render_template('/bo/bo-06-1.html')

@app.route('/bo-06-2')
@login_required
def backoffice_bo06_2():
        return  render_template('/bo/bo-06-2.html')


# ######################################################################################################################
# BACKOFFICE - 공지사항 모음
# ######################################################################################################################
@app.route('/bo-07')
@login_required
def backoffice_bo07():
        return  render_template('/bo/bo-07.html')

api.add_resource(notice,     '/notice/add', endpoint='/notice/add') 
api.add_resource(noticelist,     '/notice/list', endpoint='/notice/list') 


@app.route('/bo-07-1')
@login_required
def backoffice_bo07_1():
        return  render_template('/bo/bo-07-1.html')

@app.route('/bo-07-2')
@login_required
def backoffice_bo07_2():
        return  render_template('/bo/bo-07-2.html')

# ######################################################################################################################
# BACKOFFICE - 변위공식 관리 모음
# ######################################################################################################################
@app.route('/bo-08')
@login_required
def backoffice_bo08():
        return  render_template('/bo/bo-08.html')

@app.route('/bo-08-1')
@login_required
def backoffice_bo08_1():
        return  render_template('/bo/bo-08-1.html')

# ######################################################################################################################
# BACKOFFICE - 마스터 계정 설정
# ######################################################################################################################
@app.route('/bo-09')
@login_required
def backoffice_bo09():
        return  render_template('/bo/bo-09.html')

api.add_resource(FunctionFormula,     '/function_formula', endpoint='/function_formula') 
api.add_resource(FunctionFormulaCheck,     '/function_formula_chk', endpoint='/function_formula_chk')
api.add_resource(Formularoadcell,     '/function_formula/roadcell', endpoint='/function_formula/roadcell')
api.add_resource(raoadcellfunction,     '/function_formula/roadcell/select', endpoint='/function_formula/roadcell/select')



def weather_down():
    print("weather Down ...........................")
    weatherobj = weather()
    return_value = weatherobj.weathersave()
    if(return_value):
        print(weatherobj)

def datarogger_upload():
    print("Datarogger upload ...........................")
    datarogger_obj = dataroggerUpload()
    return_value = datarogger_obj.dataroggerupload()
    if(return_value):
        print(datarogger_obj)


def alarm_post_go():
        print("alarm post go…………..")
        alarm_obj = alarmpost()
        return_value = alarm_obj.alarmpostgo()
        if(return_value):
                print(alarm_obj)


job_defaults = {
    'coalesce': False,
    'max_instances': 30,

}
scheduler = {'apscheduler.timezone': 'Asia/Seoul'}
sched = BackgroundScheduler({ 'apscheduler.job_defaults.coalesce': 'false', 'apscheduler.job_defaults.max_instances': '30', 'apscheduler.timezone': 'UTC'})

# sched.start()
# sched.add_job(weather_down,        'interval', hours=3, id="weatherDown")
# sched.add_job(datarogger_upload,   'interval', seconds=10, id="dataroggerupload")
# sched.add_job(alarm_post_go,        'interval', seconds=10, id="alarmapost")

# ######################################################################################################################
# APP RUN
# ######################################################################################################################
if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5300)