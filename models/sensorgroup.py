from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | sensorgroup_id       | integer      | NO   | PRI |         | auto_increment |
# | sensorgroup_name     | varchar(50)  | NO   |     |         |                |
# | sensorgroup_type     | varchar(4)   | NO   |     |         | tbl_common     |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | NO   |     |         |                |
# | place_id             | integer      | NO   |     |         | tbl_place      |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class SensorgroupModel(db.Model):
    __tablename__ = 'tbl_sensorgroup'

    sensorgroup_id =    db.Column(db.Integer, primary_key=True)                                   # 센서그룹 아이디
    sensorgroup_name =  db.Column(db.String(50), nullable=False)                                  # 센서그룹 이름
    sensorgroup_type =  db.Column(db.String(4), nullable=False)                                   # 센서그룹 타입
    sensorgroup_index =  db.Column(db.Integer, nullable=False)                                   # 센서그룹 인덱스
    sensorgroup_gl1_max =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gl1_min =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gl2_max =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gl2_min =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gl3_max =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gl3_min =  db.Column(db.Integer, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_initial_date =  db.Column(db.DateTime, nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_interval =  db.Column(db.String(50), nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_fx =  db.Column(db.String(50), nullable=True)                                   # 센서그룹 인덱스
    sensorgroup_gauge_factor =  db.Column(db.String(50), nullable=True)                                   # 센서그룹 인덱스
    use_yn =            db.Column(db.String(1), nullable=False, default="Y")                      # 센서그룹 사용여부
    user_id =           db.Column(db.String(20), nullable=False)                                  # 센서그룹 등록한 사용자 아이디
    place_id =          db.Column(db.Integer, nullable=False)                                     # 센서그룹이 포함된 설치지점 아이디
    project_id =          db.Column(db.Integer, nullable=False)                                     # 센서그룹이 포함된 설치지점 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, sensorgroup_name, sensorgroup_type, sensorgroup_index, sensorgroup_gl1_max, sensorgroup_gl1_min,sensorgroup_gl2_max,sensorgroup_gl2_min, sensorgroup_gl3_max, sensorgroup_gl3_min, sensorgroup_initial_date,sensorgroup_interval, sensorgroup_fx, sensorgroup_gauge_factor, use_yn, user_id, place_id, project_id,create_date, modify_date):

        self.sensorgroup_name = sensorgroup_name
        self.sensorgroup_type = sensorgroup_type
        self.sensorgroup_index = sensorgroup_index
        self.sensorgroup_gl1_max = sensorgroup_gl1_max
        self.sensorgroup_gl1_min = sensorgroup_gl1_min
        self.sensorgroup_gl2_max = sensorgroup_gl2_max
        self.sensorgroup_gl2_min = sensorgroup_gl2_min
        self.sensorgroup_gl3_max = sensorgroup_gl3_max
        self.sensorgroup_gl3_min = sensorgroup_gl3_min
        self.sensorgroup_initial_date = sensorgroup_initial_date
        self.sensorgroup_interval = sensorgroup_interval
        self.sensorgroup_fx = sensorgroup_fx
        self.sensorgroup_gauge_factor = sensorgroup_gauge_factor
        self.use_yn = use_yn
        self.user_id = user_id
        self.place_id = place_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, sensorgroup_id):
        return cls.query.filter_by(sensorgroup_id=sensorgroup_id).first()


    @classmethod
    def find_by_project_id(cls, project_id):
        sql = """select a.sensorgroup_id, a.sensorgroup_name, a.sensorgroup_type, a.sensorgroup_index, a.sensorgroup_interval, a.place_id, a.project_id, b.place_name from tbl_sensorgroup a
                left join tbl_place b on a.place_id = b.place_id
                where a.use_yn='Y' and a.project_id='"""+project_id+"' order by a.sensorgroup_index;"
            

        return db.engine.execute(text(sql))

    @classmethod
    def sensorgroup_mapping_sensor(cls, project_id, sensorgroup_id):
        sql = """select a.project_id, a.project_name, b.place_id, b.place_name, c.sensorgroup_id,c.sensorgroup_fx, c.sensorgroup_name, c.sensorgroup_interval, d.sensor_id, d.sensor_name,d.sensor_display_name,d.sensor_type, e.sensor_fx1_name,e.sensor_fx2_name,e.sensor_fx3_name,e.sensor_fx4_name,e.sensor_fx5_name,
         c.sensorgroup_gl1_max,c.sensorgroup_gl1_min,c.sensorgroup_gl2_max,c.sensorgroup_gl2_min,c.sensorgroup_gl3_max,c.sensorgroup_gl3_min, c.sensorgroup_gauge_factor,date_format(e.sensor_initial_date, '%Y-%m-%d %H:%i') sensor_initial_date, e.sensor_initial_data,
         e.sensor_fx_check,f.function_name, c.sensorgroup_fx, d.datarogger_id,
         date_format(c.sensorgroup_initial_date, '%Y.%m.%d %H:%i') sensorgroup_initial_date, d.sensor_display_index  from tbl_project a
                left join tbl_place b on a.project_id = b.project_id
                left join tbl_sensorgroup c on b.place_id = c.place_id
                left join tbl_sensor d on c.sensorgroup_id = d.sensorgroup_id
                left join tbl_sensordetail e on d.sensor_id = e.sensor_id
                left join tbl_function f on c.sensorgroup_fx = f.function_id 
                where a.project_id = '"""+project_id+"' and c.sensorgroup_id = '"+sensorgroup_id+"""' and d.use_yn = 'Y' order by d.sensor_display_index"""
        
        return db.engine.execute(text(sql))

    @classmethod
    def sensorgroup_mapping_sensor_data(cls, datarogger_id, sensorname_list):
        sql = """sselect date_format(sensor_data_date, '%Y-%m-%d %H:%i:%S') sensor_data_date, sensor_name, sensor_data, substr(sensor_data_date,12,2)
                from tbl_editdata
                where datarogger_id = '8' and sensor_name in ('1P01', '1P03', '1P04')
                and sensor_data_date between '2022.01.01 00:00' and '2022.02.05 00:00' and substr(sensor_data_date,12,2)='01' and mod(TIMESTAMPDIFF(DAY,'2022.01.01 00:00',sensor_data_date), 1)=0
                order by sensor_data_date;"""
        return db.engine.execute(text(sql))
    
    @classmethod
    def sensorgroup_mapping_place_id(cls, place_id):
        sql = """select * from tbl_sensorgroup
                where place_id = '"""+place_id+"""' and use_yn='Y'"""
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()