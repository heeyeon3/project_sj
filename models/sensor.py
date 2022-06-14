from datetime import datetime

from sqlalchemy import engine
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | sensor_id            | integer      | NO   | PRI |         | auto_increment  |
# | sensor_name          | varchar(20)  | NO   |     |         |                 |
# | sensor_sn            | varchar(20)  | NO   |     |         |                 |
# | sensor_type          | varchar(4)   | NO   |     |         |       |
# | sensor_interval      | varchar(10)  | NO   |     |         |                 | 
# | sensor_index         | integer      | NO   |     |         |                 |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | sensorgroup_id       | integer      |      |     |         | tbl_sensorgroup |
# | datarogger_id        | integer      | NO   |     |         | tbl_datarogger  |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class SensorModel(db.Model):
    __tablename__ = 'tbl_sensor'

    sensor_id =       db.Column(db.Integer, primary_key=True)                                   # 센서 아이디
    sensor_name =     db.Column(db.String(20), nullable=False)                                  # 센서 이름
    sensor_display_name =     db.Column(db.String(45), nullable=False)                                  # 센서 이름
    sensor_sn =       db.Column(db.String(20), nullable=True)                                  # 센서 시리얼넘버
    sensor_type =     db.Column(db.String(6), nullable=False)                                   # 센서 데이터타입
    sensor_interval = db.Column(db.String(10), nullable=True)                                  # 센서 측정간격
    sensor_index =    db.Column(db.Integer, nullable=False)                                     # 센서 데이터넘버(데이터로거에서의 index)
    sensor_display_index =    db.Column(db.Integer, nullable=False)                                     # 센서 데이터넘버(데이터로거에서의 index)
    use_yn =          db.Column(db.String(1), nullable=False, default="Y")                      # 센서 사용여부
    user_id =         db.Column(db.String(20), nullable=False)                                  # 센서 등록한 사용자 아이디
    sensorgroup_id =  db.Column(db.Integer, nullable=True)                                      # 센서가 포함된 센서 아이디
    datarogger_id =   db.Column(db.Integer, nullable=False)                                     # 센서가 포함된 프로젝트 아이디
    create_date =     db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =     db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, sensor_name, sensor_display_name, sensor_sn, sensor_type, sensor_interval, sensor_index, sensor_display_index, use_yn, user_id, sensorgroup_id, datarogger_id, create_date, modify_date):

        self.sensor_name = sensor_name
        self.sensor_display_name = sensor_display_name
        self.sensor_sn = sensor_sn
        self.sensor_type = sensor_type
        self.sensor_interval = sensor_interval
        self.sensor_index = sensor_index
        self.sensor_display_index = sensor_display_index
        self.use_yn = use_yn
        self.user_id = user_id
        self.sensorgroup_id = sensorgroup_id
        self.datarogger_id = datarogger_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, sensor_id):
        return cls.query.filter_by(sensor_id=sensor_id).first()

    @classmethod
    def find_by_datarogger_id_sensorname(cls, sensor_name,datarogger_id):
        # print('!',sensor_name,datarogger_id)
        return cls.query.filter_by(sensor_name=sensor_name,datarogger_id=datarogger_id).first()


    @classmethod
    def find_by_datarogger_id(cls, datarogger_id):
        sql = """select sensor_id, sensor_name, sensor_display_name, sensor_sn, sensor_type, sensor_interval, use_yn,sensor_index, sensor_display_index,sensorgroup_id, datarogger_id from tbl_sensor
                where datarogger_id = '"""+datarogger_id + """' order by sensor_display_index;"""
 
        return db.engine.execute(text(sql))


    @classmethod
    def find_by_datarogger_id_snesorgroup(cls, sensorgroup_id):
    
        sql = """select a.sensor_id, a.sensor_name,a.sensor_display_name, a.sensor_sn, a.sensor_type, a.sensor_interval, a.sensor_index,
                b.sensor_fx1, b.sensor_fx2,b.sensor_fx3,b.sensor_fx4,b.sensor_fx5,
                 a.sensorgroup_id, a.datarogger_id, b.sensor_gauge_factor, b.sensor_fx_check,b.sensor_initial_date, b.sensor_initial_data, b.sensor_gauge_factor from tbl_sensor a
                left join tbl_sensordetail b on a.sensor_id = b.sensor_id
                where a.sensorgroup_id = '"""+sensorgroup_id+"""' and a.use_yn = 'Y'  order by a.sensor_display_index;"""

        # 

        return db.engine.execute(text(sql))

    @classmethod
    def left_menu(cls, project_id):
        
        sql = """SELECT a.sensor_id,a.sensor_name, a.sensor_display_name, a.sensor_sn,a.sensor_type,a.sensor_interval,a.sensor_index, a.sensorgroup_id, b.sensorgroup_type,
                b.sensorgroup_name, c.place_id, c.place_name, c.project_id, d.datarogger_id, b.sensorgroup_index, c.place_index
                from tbl_sensor a left join tbl_datarogger d on a.datarogger_id = d.datarogger_id
                left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id left join tbl_place c on b.place_id = c.place_id
                where a.sensorgroup_id is not null and c.project_id = '"""+project_id+"""' and a.use_yn = 'Y' and b.use_yn = 'Y' and c.use_yn='Y' order by c.place_index, b.sensorgroup_index, a.sensor_display_index; """

        print(sql)
   
        return db.engine.execute(text(sql))

    @classmethod
    def all_sensor_setting(cls,project_id):
        
        sql = """
                select a.datarogger_id, a.datarogger_name, a.project_id,b.sensor_id, b.sensor_name, b.sensor_display_name from tbl_datarogger a
                right join tbl_sensor b on a.datarogger_id = b.datarogger_id
                where a.project_id = '"""+project_id+"""' and b.use_yn='Y';"""

        return db.engine.execute(text(sql))


    @classmethod
    def all_sensor_list(cls, sensorgroup_id):
        
        sql = """
            select a.sensor_id, b.sensorgroup_id,  b.sensor_name, b.datarogger_id, b.sensor_display_name
            from tbl_sensordetail a
            left join tbl_sensor b on a.sensor_id=b.sensor_id
            where b.sensorgroup_id = '"""+sensorgroup_id+"""';"""


        return db.engine.execute(text(sql))

    @classmethod
    def sensor_id_info(cls, sensor_id):
        
        sql = """
            select a.sensor_display_name, a.sensor_id, a.sensor_type, b.sensorgroup_id, b.sensorgroup_name, b.sensorgroup_type, c.place_name, c.project_id, d.project_name
            from tbl_sensor a
            left join tbl_sensorgroup b on a.sensorgroup_id = b.sensorgroup_id
            left join tbl_place c on b.place_id = c.place_id
            left join tbl_project d on c.project_id = d.project_id
            where a.sensor_id = '"""+sensor_id+"""';"""


        return db.engine.execute(text(sql))


    


    

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()