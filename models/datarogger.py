from datetime import datetime
from pymysql import NULL

from sqlalchemy import null
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | datarogger_id        | integer      | NO   | PRI |         | auto_increment |
# | datarogger_name      | varchar(50)  | NO   |     |         |                |
# | datarogger_url       | varchar(100)  | NO   |     |         |                |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | YES  |     | NULL    |                |
# | project_id           | integer      | YES  |     | NULL    | tbl_place      |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class DataroggerModel(db.Model):
    __tablename__ = 'tbl_datarogger'

    datarogger_id =    db.Column(db.Integer, primary_key=True)                                   # 데이터로거 아이디
    datarogger_name =  db.Column(db.String(100), nullable=False)                                  # 데이터로거 이름
    datarogger_url =   db.Column(db.String(200), nullable=False)                                  # 데이터로거 저장위치
    datarogger_request =   db.Column(db.String(45), nullable=False)                                  # 데이터로거 저장위치
    use_yn =           db.Column(db.String(1), nullable=False, default="Y")                      # 데이터로거 사용여부
    user_id =          db.Column(db.String(50), nullable=True, default=None)                                  # 데이터로거 등록한 사용자 아이디
    company_id =       db.Column(db.Integer, nullable=True, default=None)                                     # 데이터로거가 포함된 프로젝트 아이디
    project_id =       db.Column(db.Integer, nullable=True, default=None)                                     # 데이터로거가 포함된 프로젝트 아이디
    create_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, datarogger_name, datarogger_url, datarogger_request, use_yn, user_id, company_id, project_id, create_date, modify_date):

        self.datarogger_name = datarogger_name
        self.datarogger_url = datarogger_url
        self.datarogger_request = datarogger_request
        self.use_yn = use_yn
        self.user_id = user_id
        self.company_id = company_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, datarogger_id):
        return cls.query.filter_by(datarogger_id=datarogger_id).first()

    @classmethod
    def find_by_name(cls, datarogger_name, company_id):
        return cls.query.filter_by(datarogger_name=datarogger_name, company_id=company_id).first()

    @classmethod
    def datalogger_list(cls, company_id):
       
        sql = """select datarogger_id, datarogger_name from tbl_datarogger where company_id='"""+company_id+"""';"""
        
        # sql = """select datalogger_id, datalogger_name from tbl_datarogger"""

        return db.engine.execute(text(sql))

    @classmethod
    def datalogger_project(cls, project_id):
       
        sql = """select datarogger_id, datarogger_name from tbl_datarogger where project_id='"""+project_id+"""'"""
      
        # sql = """select datalogger_id, datalogger_name from tbl_datarogger"""

        return db.engine.execute(text(sql))


    @classmethod
    def datalogger_list_project(cls, project_id):
       
        sql = """select a.sensor_id, a.sensor_name, b.datarogger_name, a.sensorgroup_id, a.use_yn, b.datarogger_id from tbl_sensor a
                left join tbl_datarogger b on a.datarogger_id = b.datarogger_id
                where project_id = '"""+project_id+"""' order by b.datarogger_id;"""
             
        
      
        
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()