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
# | alarm_id            | integer      | NO   | PRI |         | auto_increment  |
# | alarm_status       | varchar(20)  | NO   |     |         |                 |
# | sensor_id      | varchar(50)  | NO   |     |         |                 |
# | datarogger_id               | varchar(1)   | NO   |     | "Y"     |                 |
# | use_yn              | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class AlarmModel(db.Model):
    __tablename__ = 'tbl_alarm'

    alarm_id =         db.Column(db.Integer, primary_key=True)                                 # 공지사항 아이디
    alarm_detail =     db.Column(db.String(45), nullable=False)                                # 공지사항 이름
    alarm_status =     db.Column(db.String(100), nullable=False)                               # 일람 생타

    alarm_post_request = db.Column(db.String(45), nullable=True)         
    alarm_post_yn = db.Column(db.String(1), nullable=True)  
    alarm_post_date = db.Column(db.DateTime, nullable=False, default=datetime.now())

    sensor_id =        db.Column(db.Integer, nullable=False)                                # 공지사항 식
    datarogger_id =    db.Column(db.Integer, nullable=False)                                # 공지사항 식
    editdata_id =    db.Column(db.Integer, nullable=False)                                # 공지사항 식
    sensor_data_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())

    use_yn =           db.Column(db.String(1), nullable=False, default="Y")                    # 알람 보일지 않보일지
    project_id =       db.Column(db.Integer, nullable=False)                                # 공지사항 등록한 사용자 아이디
    create_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, alarm_detail, alarm_status,  sensor_id, alarm_post_request, alarm_post_yn, alarm_post_date, datarogger_id, editdata_id, sensor_data_date, use_yn, project_id,  create_date, modify_date):

        self.alarm_detail = alarm_detail
        self.alarm_status = alarm_status
        self.sensor_id = sensor_id
        self.alarm_post_request = alarm_post_request
        self.alarm_post_yn = alarm_post_yn
        self.alarm_post_date = alarm_post_date
        self.datarogger_id = datarogger_id
        self.editdata_id = editdata_id
        self.sensor_data_date = sensor_data_date
        self.use_yn = use_yn
        self.project_id = project_id

        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, alarm_id):
        return cls.query.filter_by(alarm_id=alarm_id).first()
    
    @classmethod
    def find_by_sensor_id_datetime(cls, datarogger_id, sensor_id, sensor_data_date):
        return cls.query.filter_by(datarogger_id=datarogger_id, sensor_id=sensor_id, sensor_data_date=sensor_data_date ).first()
    
    @classmethod
    def find_by_id_sql(cls, alarm_id):

        sql = "select date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date from tbl_alarm where alarm_id='"+alarm_id+"';"
        return db.engine.execute(text(sql))

    @classmethod
    def find_by_all(cls):
        sql ="""select a.alarm_id, a.alarm_detail, a.alarm_status, a.sensor_id, a.datarogger_id, a.project_id, date_format(a.create_date, '%Y.%m.%d %H:%i:%S') create_date, b.project_name, c.company_name, d.sensor_name, 
                d.sensor_display_name, d.sensor_type, e.sensorgroup_name, e.sensorgroup_type, f.place_name  from tbl_alarm a
                left join tbl_project b on a.project_id = b.project_id
                left join tbl_company c on b.company_id = c.company_id
                left join tbl_sensor d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup e on d.sensorgroup_id = e.sensorgroup_id
                left join tbl_place f on f.place_id = e.place_id
                ;

            ;"""
        return db.engine.execute(text(sql))


    # @classmethod
    # def find_by_alarm_list(cls):
    #     sql ="""select alarm_id, alarm_title, alarm_contents, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
    #             from tbl_alarm order by create_date desc"""
    #     return db.engine.execute(text(sql))


    @classmethod
    def find_by_alarm_info(cls, alarm_id):
        sql ="""select a.alarm_id, a.alarm_detail, a.alarm_status, a.sensor_id, a.datarogger_id, a.project_id, date_format(a.create_date, '%Y.%m.%d %H:%i:%S') create_date, b.project_name, c.company_name, d.sensor_name, 
                d.sensor_display_name, d.sensor_type, e.sensorgroup_name, e.sensorgroup_type, f.place_name  from tbl_alarm a
                left join tbl_project b on a.project_id = b.project_id
                left join tbl_company c on b.company_id = c.company_id
                left join tbl_sensor d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup e on d.sensorgroup_id = e.sensorgroup_id
                left join tbl_place f on f.place_id = e.place_id
                where a.alarm_id ='""" +alarm_id+"';"

            
        return db.engine.execute(text(sql))


    @classmethod
    def find_by_project_id(cls, project_id):
        sql ="""select alarm_id,alarm_detail, alarm_status,a.sensor_id,  date_format(sensor_data_date, '%Y.%m.%d %H:%i:%S') sensor_data_date,a.use_yn, b.sensor_name, b.sensorgroup_id, d.place_id  from tbl_alarm a
                left join tbl_sensor b on a.sensor_id = b.sensor_id
                left join tbl_sensorgroup c on b.sensorgroup_id = c.sensorgroup_id
                left join tbl_place d on c.place_id = d.place_id 
                where a.project_id ='""" +project_id+"' and a.use_yn = 'Y';"

            
        return db.engine.execute(text(sql))

    @classmethod
    def count_place(cls, project_id):
        sql ="""select d.place_id , count(d.place_id ) place_count from tbl_alarm a
                left join tbl_sensor b on a.sensor_id = b.sensor_id
                left join tbl_sensorgroup c on b.sensorgroup_id = c.sensorgroup_id
                left join tbl_place d on c.place_id = d.place_id 
                where a.project_id ='"""+project_id+"""' and a.use_yn = 'Y'
                group by d.place_id """
            
        return db.engine.execute(text(sql))

    @classmethod
    def count_sensorgroup(cls, project_id):
        sql ="""select  b.sensorgroup_id, count(b.sensorgroup_id) sensorgroup_count from tbl_alarm a
                left join tbl_sensor b on a.sensor_id = b.sensor_id
                left join tbl_sensorgroup c on b.sensorgroup_id = c.sensorgroup_id
                left join tbl_place d on c.place_id = d.place_id 
                where a.project_id ='"""+project_id+"""' and a.use_yn = 'Y'
                group by  b.sensorgroup_id"""
            
        return db.engine.execute(text(sql))

    @classmethod
    def count_sensor(cls, project_id):
        sql ="""select  a.sensor_id, count(a.sensor_id) sensorcount from tbl_alarm a
                left join tbl_sensor b on a.sensor_id = b.sensor_id
                left join tbl_sensorgroup c on b.sensorgroup_id = c.sensorgroup_id
                left join tbl_place d on c.place_id = d.place_id 
                where a.project_id ='"""+project_id+"""' and a.use_yn = 'Y'
                group by  a.sensor_id"""
            
        return db.engine.execute(text(sql))
    
    @classmethod
    def alarm_list_project_id(cls, project_id):
        sql ="""select  alarm_id, use_yn from tbl_alarm 
              
                where project_id ='"""+project_id+"""' and use_yn = 'Y'"""
            
        return db.engine.execute(text(sql))


    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()