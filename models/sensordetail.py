from datetime import datetime

from sqlalchemy import sql
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | sensor_detail_id     | integer      | NO   | PRI |         | auto_increment  |
# | sensor_initial       | varchar(10)  |      |     |         |                 |
# | sensor_gl1_max       | varchar(10)  | NO   |     |         |                 |
# | sensor_gl1_min       | varchar(10)  | NO   |     |         | tbl_common      |
# | sensor_gl2_max       | varchar(10)  | NO   |     |         |                 | 
# | sensor_gl2_min       | varchar(10)  | NO   |     |         |                 |
# | sensor_gl3_max       | varchar(10)  | NO   |     |         |                 |
# | sensor_gl3_min       | varchar(10)  | NO   |     |         |                 |
# | sensor_fx1           | varchar(50)  | NO   |     |         |                 |
# | sensor_fx2           | varchar(50)  | NO   |     |         |                 |
# | sensor_fx3           | varchar(50)  | NO   |     |         |                 |
# | sensor_fx4           | varchar(50)  | NO   |     |         |                 |
# | sensor_fx5           | varchar(50)  | NO   |     |         |                 |
# | sensor_max           | varchar(10)  |      |     |         |                 |
# | sensor_min           | varchar(10)  |      |     |         |                 |
# | sensor_weight        | varchar(10)  |      |     |         |                 |
# | sensor_deviation     | varchar(10)  |      |     |         |                 |
# | sensor_st_over_ex    | varchar(1)   |      |     | "N"     |                 |
# | sensor_st_over_wt    | varchar(1)   |      |     | "N"     |                 |
# | sensor_dev_over_ex   | varchar(1)   |      |     | "N"     |                 |
# | sensor_dev_over_wt   | varchar(1)   |      |     | "N"     |                 |
# | sensor_null_ex       | varchar(1)   |      |     | "N"     |                 |
# | sensor_default_wt    | varchar(1)   |      |     | "N"     |                 |
# | sensor_noti          | varchar(1)   | NO   |     | "Y"     |                 |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | sensor_id            | integer      | NO   |     |         | tbl_sensor      |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class SensorDetailModel(db.Model):
    __tablename__ = 'tbl_sensordetail'

    sensor_detail_id =     db.Column(db.Integer, primary_key=True)                                 # 센서 디테일 아이디
    sensor_initial_date =       db.Column(db.DateTime, nullable=True)                                 # 센서 기본값
    sensor_initial_data =       db.Column(db.String(10), nullable=True)                                 # 센서 기본값
    sensor_gl1_max =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_gl1_min =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인1 최소값
    sensor_gl2_max =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인2 최대값
    sensor_gl2_min =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인2 최소값
    sensor_gl3_max =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인3 최대값
    sensor_gl3_min =       db.Column(db.String(10), nullable=True)                                # 센서 가이드라인3 최소값
    sensor_fx1 =           db.Column(db.String(200), nullable=True)                                # 센서 변위공식 1
    sensor_fx2 =           db.Column(db.String(200), nullable=True)                                # 센서 변위공식 2
    sensor_fx3 =           db.Column(db.String(200), nullable=True)                                # 센서 변위공식 3
    sensor_fx4 =           db.Column(db.String(200), nullable=True)                                # 센서 변위공식 4
    sensor_fx5 =           db.Column(db.String(200), nullable=True)                                # 센서 변위공식 5
    sensor_max =           db.Column(db.String(10), nullable=True)                                 # 센서 치환 상한 기준값
    sensor_min =           db.Column(db.String(10), nullable=True)                                 # 센서 치환 하한 기준값
    sensor_weight =        db.Column(db.String(10), nullable=True)                                 # 센서 변화량 가중치
    sensor_deviation =     db.Column(db.String(10), nullable=True)                                 # 센서 측정값 편차범위
    sensor_st_over_ex =    db.Column(db.String(1), nullable=True, default="N")                     # 센서 기준값 범위 밖 이전 데이터        (기준값 초과/미만시 이전 데이터로 치환)
    sensor_st_over_wt =    db.Column(db.String(1), nullable=True, default="N")                     # 센서 기준값 범위 밖 변화량 데이터      (기준값 초과/미만시 변화량 가중치 데이터로 치환)
    sensor_dev_over_ex =   db.Column(db.String(1), nullable=True, default="N")                     # 센서 편차범위 밖 이전데이터 적용       (편차범위 초과/미만시 이전 데이터로 치환)
    sensor_dev_over_wt =   db.Column(db.String(1), nullable=True, default="N")                     # 센서 편차범위 밖 변화량 가중치 적용     (편차범위 초과/미만시 변화량 가중치 데이터로 치환)
    sensor_null_ex =       db.Column(db.String(1), nullable=True, default="N")                     # 센서 NULL값인 경우 이전데이터 적용     (NULL인 경우 이전 데이터로 치환)
    sensor_default_wt =    db.Column(db.String(1), nullable=True, default="N")                     # 센서 변화량 가중치 기본(DEFAULT) 적용  
    sensor_noti =          db.Column(db.String(1), nullable=True, default="N")                    # 센서 게이지 패터
    sensor_gauge_factor =  db.Column(db.String(1), nullable=True)                    # 센서 담당자에게 알림설정
    sensor_fx1_name =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx2_name =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx3_name =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx4_name =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx5_name =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx_check =       db.Column(db.String(45), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx1_id =       db.Column(db.String(50), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx2_id =       db.Column(db.String(50), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx3_id =       db.Column(db.String(50), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx4_id =       db.Column(db.String(50), nullable=True)                                # 센서 가이드라인1 최대값
    sensor_fx5_id =       db.Column(db.String(50), nullable=True)                                # 센서 가이드라인1 최대값

    use_yn =               db.Column(db.String(1), nullable=True, default="Y")                    # 센서 사용여부
    user_id =              db.Column(db.String(20), nullable=False)                                # 센서 등록한 사용자 아이디
    sensor_id =            db.Column(db.Integer, nullable=False)                                   # 센서 아이디
    create_date =          db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =          db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, sensor_initial_date, sensor_initial_data, sensor_gl1_max, sensor_gl1_min, sensor_gl2_max, sensor_gl2_min, sensor_gl3_max, sensor_gl3_min, sensor_fx1, sensor_fx2, sensor_fx3, sensor_fx4, sensor_fx5,
    sensor_max, sensor_min, sensor_weight, sensor_deviation, sensor_st_over_ex, sensor_st_over_wt, sensor_dev_over_ex, sensor_dev_over_wt, sensor_null_ex, sensor_default_wt, sensor_noti, sensor_gauge_factor,
    sensor_fx1_name, sensor_fx2_name, sensor_fx3_name, sensor_fx4_name, sensor_fx5_name, sensor_fx_check, sensor_fx1_id, sensor_fx2_id, sensor_fx3_id,sensor_fx4_id,sensor_fx5_id, use_yn, user_id,
    sensor_id, create_date, modify_date):

        self.sensor_initial_date = sensor_initial_date
        self.sensor_initial_data = sensor_initial_data
        self.sensor_gl1_max = sensor_gl1_max
        self.sensor_gl1_min = sensor_gl1_min
        self.sensor_gl2_max = sensor_gl2_max
        self.sensor_gl2_min = sensor_gl2_min
        self.sensor_gl3_max = sensor_gl3_max
        self.sensor_gl3_min = sensor_gl3_min
        self.sensor_fx1 = sensor_fx1
        self.sensor_fx2 = sensor_fx2
        self.sensor_fx3 = sensor_fx3
        self.sensor_fx4 = sensor_fx4
        self.sensor_fx5 = sensor_fx5
        self.sensor_max = sensor_max
        self.sensor_min = sensor_min
        self.sensor_weight = sensor_weight
        self.sensor_deviation = sensor_deviation
        self.sensor_st_over_ex = sensor_st_over_ex
        self.sensor_st_over_wt = sensor_st_over_wt
        self.sensor_dev_over_ex = sensor_dev_over_ex
        self.sensor_dev_over_wt = sensor_dev_over_wt
        self.sensor_null_ex = sensor_null_ex
        self.sensor_default_wt = sensor_default_wt
        self.sensor_noti = sensor_noti
        self.sensor_gauge_factor = sensor_gauge_factor
        self.sensor_fx1_name = sensor_fx1_name
        self.sensor_fx2_name = sensor_fx2_name
        self.sensor_fx3_name = sensor_fx3_name
        self.sensor_fx4_name = sensor_fx4_name
        self.sensor_fx5_name = sensor_fx5_name
        self.sensor_fx_check = sensor_fx_check

        self.sensor_fx1_id = sensor_fx1_id
        self.sensor_fx2_id = sensor_fx2_id
        self.sensor_fx3_id = sensor_fx3_id
        self.sensor_fx4_id = sensor_fx4_id
        self.sensor_fx5_id = sensor_fx5_id

        self.use_yn = use_yn
        self.user_id = user_id
        self.sensor_id = sensor_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, sensor_detail_id):
        return cls.query.filter_by(sensor_detail_id=sensor_detail_id).first()

    @classmethod
    def find_by_sensor_id(cls, sensor_id):
        return cls.query.filter_by(sensor_id=sensor_id).first()


    @classmethod
    def sensordetail_list(cls, datarogger_id):
        sql=""" SELECT a.sensor_id,a.sensor_name, a.sensor_display_name, a.sensor_display_index, a.sensor_sn,a.sensor_type,a.sensor_interval,a.sensor_index, a.sensorgroup_id, a.datarogger_id, b.sensorgroup_type,
                b.sensorgroup_id, b.sensorgroup_name, c.place_id, c.place_name, d.sensor_detail_id,date_format(d.sensor_initial_date, '%Y-%m-%d %H:%i:%S') sensor_initial_date,d.sensor_initial_data, d.sensor_gl1_max, d.sensor_gl1_min,d.sensor_gl2_max,
                d.sensor_gl2_min, d.sensor_gl3_max, d.sensor_gl3_min, d.sensor_fx1, d.sensor_fx2, d.sensor_fx3, d.sensor_fx4, d.sensor_fx5,
                d.sensor_max, d.sensor_min, d.sensor_weight, d.sensor_deviation, d.sensor_st_over_ex, d.sensor_st_over_wt, d.sensor_dev_over_ex,
                d.sensor_dev_over_wt, d.sensor_null_ex, d.sensor_default_wt, d.sensor_noti, e.datarogger_name, e.project_id
                from tbl_sensor a
                left join tbl_sensordetail d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id left join tbl_place c on b.place_id = c.place_id 
                left join tbl_datarogger e on a.datarogger_id = e.datarogger_id
                where a.datarogger_id='"""+datarogger_id+"""' and a.use_yn='Y' order by sensor_display_index"""
        
  

        # 
        return db.engine.execute(text(sql))


    @classmethod
    def sensordetail_info_sensor_id(cls, sensor_id):
        sql=""" SELECT a.sensor_id,a.sensor_name, a.sensor_display_name, a.sensor_sn,a.sensor_type,a.sensor_interval,a.datarogger_id, a.sensor_index, a.sensorgroup_id, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, 
                b.sensorgroup_name, b.sensorgroup_type, c.place_id,  c.place_name, d.sensor_detail_id,  d.sensor_initial_data, date_format(d.sensor_initial_date, '%Y.%m.%d %H:%i') sensor_initial_date, d.sensor_gl1_max, d.sensor_gl1_min,d.sensor_gl2_max, f.project_id, f.project_name,
                d.sensor_gl2_min, d.sensor_gl3_max, d.sensor_gl3_min, d.sensor_fx1, d.sensor_fx2, d.sensor_fx3, d.sensor_fx4, d.sensor_fx5, d.sensor_fx1_name, d.sensor_fx2_name, d.sensor_fx3_name, d.sensor_fx4_name, d.sensor_fx5_name, d.sensor_fx_check,
                d.sensor_max, d.sensor_min, d.sensor_weight, d.sensor_deviation, d.sensor_st_over_ex, d.sensor_st_over_wt, d.sensor_dev_over_ex,
                d.sensor_dev_over_wt, d.sensor_null_ex, d.sensor_default_wt, d.sensor_noti, d.sensor_gauge_factor, e.datarogger_name, c.place_lat, c.place_lng, f.project_id, d.sensor_fx1_id, d.sensor_fx2_id, d.sensor_fx3_id, d.sensor_fx4_id, d.sensor_fx5_id
                from tbl_sensor a
                left join tbl_sensordetail d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id left join tbl_place c on
                b.place_id = c.place_id 
                left join tbl_datarogger e on e.datarogger_id = a.datarogger_id
                left join tbl_project f on f.project_id = c.project_id
                where a.sensor_id = '"""+sensor_id+"';"


        return db.engine.execute(text(sql))



    @classmethod
    def sensordetail_info_project_id(cls, project_id):
        sql=""" SELECT a.sensor_id,a.sensor_name, a.sensor_sn,a.sensor_type,a.sensor_interval,a.sensor_index, a.sensorgroup_id, a.datarogger_id,
                b.sensorgroup_id, b.sensorgroup_name, b.sensorgroup_type, c.place_id, c.place_name, d.sensor_detail_id,date_format(d.sensor_initial_date, '%Y.%m.%d %H:%i') sensor_initial_date,d.sensor_initial_data, d.sensor_gl1_max, d.sensor_gl1_min,d.sensor_gl2_max,
                d.sensor_gl2_min, d.sensor_gl3_max, d.sensor_gl3_min, d.sensor_fx1, d.sensor_fx2, d.sensor_fx3, d.sensor_fx4, d.sensor_fx5,
                d.sensor_max, d.sensor_min, d.sensor_weight, d.sensor_deviation, d.sensor_st_over_ex, d.sensor_st_over_wt, d.sensor_dev_over_ex,
                d.sensor_dev_over_wt, d.sensor_null_ex, d.sensor_default_wt, d.sensor_noti, e.project_id
                from tbl_sensor a
                left join tbl_sensordetail d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id left join tbl_place c on
                b.place_id = c.place_id
                left join tbl_datarogger e on a.datarogger_id = e.datarogger_id where e.project_id= '"""+project_id+"' and a.use_yn ='Y';"



        return db.engine.execute(text(sql))

    @classmethod
    def find_by_sensor_id_function(cls, sensor_id):
    
        sql = """select sensor_fx1, sensor_fx2, sensor_fx3, sensor_fx4, sensor_fx5, sensor_id, sensor_initial_data, sensor_fx1_name, sensor_fx2_name, sensor_fx3_name, sensor_fx4_name, sensor_fx5_name, sensor_fx_check, sensor_gauge_factor from tbl_sensordetail
                where sensor_id = '"""+sensor_id+"""';"""

        
        return db.engine.execute(text(sql))

    @classmethod
    def find_by_scatter_another_sensor(cls, param):

        sensor_display_name, sensorgroup_id, sensor_id = param
        sql = """select sensor_id from tbl_sensor
            where sensor_display_name ='"""+sensor_display_name+"""' and sensorgroup_id = '"""+sensorgroup_id+"""'
            and sensor_id !='"""+sensor_id+"""';"""

        # 
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()