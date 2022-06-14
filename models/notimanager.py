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
# | notimanager_id       | integer      | NO   | PRI |         | auto_increment  |
# | notimanager_status   | varchar(20)  | NO   |     |         |                 |
# | sensor_id            | varchar(50)  | NO   |     |         |                 |
# | datarogger_id        | varchar(1)   | NO   |     | "Y"     |                 |
# | use_yn               | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class NotimanagerModel(db.Model):
    __tablename__ = 'tbl_notimanager'

    notimanager_id =         db.Column(db.Integer, primary_key=True)                                 # 공지사항 아이디
    notimanager_name =     db.Column(db.String(45), nullable=False)                                # 공지사항 이름
    notimanager_num =     db.Column(db.String(45), nullable=False)                                # 공지사항 이름
    notimanager_kakao =        db.Column(db.String(1), nullable=False)                                # 공지사항 식
    notimanager_lv1 =        db.Column(db.String(1), nullable=False)                                # 공지사항 식
    notimanager_lv2 =        db.Column(db.String(1), nullable=False)                                # 공지사항 식
    notimanager_lv3 =        db.Column(db.String(1), nullable=False)                                # 공지사항 식
    
  
    use_yn =           db.Column(db.String(1), nullable=False, default="Y")                    # 공지사항 사용여부
    project_id =       db.Column(db.Integer, nullable=False)                                # 공지사항 등록한 사용자 아이디
    create_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, notimanager_name, notimanager_num,  notimanager_kakao, notimanager_lv1, notimanager_lv2, notimanager_lv3, use_yn, project_id,  create_date, modify_date):

        self.notimanager_name = notimanager_name
        self.notimanager_num = notimanager_num
        self.notimanager_kakao = notimanager_kakao
        self.notimanager_lv1 = notimanager_lv1
        self.notimanager_lv2 = notimanager_lv2
        self.notimanager_lv3 = notimanager_lv3
        self.use_yn = use_yn
        self.project_id = project_id

        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, notimanager_id):
        return cls.query.filter_by(notimanager_id=notimanager_id).first()

    @classmethod
    def find_by_project(cls, project_id):
        sql ="""select notimanager_id, notimanager_name, notimanager_num, notimanager_kakao, notimanager_lv1, notimanager_lv2, notimanager_lv3 from tbl_notimanager
                where use_yn = 'Y' and project_id ='"""+project_id+"""' order by create_date desc;"""

        
        return db.engine.execute(text(sql))


    # @classmethod
    # def find_by_notimanager_list(cls):
    #     sql ="""select notimanager_id, notimanager_title, notimanager_contents, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
    #             from tbl_notimanager order by create_date desc"""
    #     return db.engine.execute(text(sql))


    @classmethod
    def find_by_notimanager_info(cls, notimanager_id):
        sql ="""select a.notimanager_id, a.notimanager_detail, a.notimanager_status, a.sensor_id, a.datarogger_id, a.project_id, date_format(a.create_date, '%Y.%m.%d %H:%i:%S') create_date, b.project_name, c.company_name, d.sensor_name, 
                d.sensor_display_name, d.sensor_type, e.sensorgroup_name, e.sensorgroup_type, f.place_name  from tbl_notimanager a
                left join tbl_project b on a.project_id = b.project_id
                left join tbl_company c on b.company_id = c.company_id
                left join tbl_sensor d on a.sensor_id = d.sensor_id
                left join tbl_sensorgroup e on d.sensorgroup_id = e.sensorgroup_id
                left join tbl_place f on f.place_id = e.place_id
                where a.notimanager_id ='""" +notimanager_id+"';"

            
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()