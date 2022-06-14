from datetime import datetime
from pymysql import NULL

from sqlalchemy import null
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +-------------------------------+--------------+------+-----+---------+----------------+
# | Field                         | Type         | Null | Key | Default | Extra          |
# +-------------------------------+--------------+------+-----+---------+----------------+
# | servicecenter_id              | integer      | NO   | PRI |         | auto_increment |
# | servicecenter_name            | varchar(1000)| NO   |     |         |                |
# | servicecenter_status          | varchar(200) | NO   |     |         |                |
# | servicecenter_inquiry         | varchar(2000)| NO   |     |         |                |
# | servicecenter_file            | varchar(200) | NO   |     |         |                |
# | use_yn                        | varchar(1)   | NO   |     | "Y"     |                |
# | user_id                       | varchar(20)  | YES  |     | NULL    |                |
# | project_id                    | integer      | YES  |     | NULL    | tbl_project    |
# | create_date                   | datetime     | YES  |     |         |                |
# | modify_date                   | datetime     | YES  |     |         |                |
# | servicecenter_answer          | varchar(2000)| YES  |     |         |                |
# | servicecenter_answer_state    | varchar(100) | YES  |     |         |                |
# | servicecenter_answer_date     | datetime     | YES  |     |         |                |
# +-------------------------------+--------------+------+-----+---------+----------------+

class ServicecenterModel(db.Model):
    __tablename__ = 'tbl_servicecenter'

    servicecenter_id =              db.Column(db.Integer, primary_key=True)                                   # 고객센터 아이디
    servicecenter_name =            db.Column(db.String(100), nullable=False)                                 # 고객센터 제목
    servicecenter_status =          db.Column(db.String(1000), nullable=False)                                # 고객센터 상태
    servicecenter_inquiry =         db.Column(db.String(2000), nullable=False)                                # 고객센터 내용
    servicecenter_file =            db.Column(db.String(200), nullable=True)                                  # 고객센터 저장위치
    use_yn =                        db.Column(db.String(1), nullable=False, default="Y")                      # 고객센터 사용여부
    user_id =                       db.Column(db.String(20), nullable=False, default=None)                    # 고객센터 등록한 사용자 아이디
    project_id =                    db.Column(db.Integer, nullable=False, default=None)                       # 고객센터가 포함된 프로젝트 아이디
    create_date =                   db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =                   db.Column(db.DateTime, nullable=False, default=datetime.now())
    servicecenter_answer =          db.Column(db.String(2000), nullable=True)
    servicecenter_answer_state =    db.Column(db.String(100), nullable=True)
    servicecenter_answer_date =     db.Column(db.DateTime, nullable=True)

    def __init__(self, servicecenter_name, servicecenter_status, servicecenter_inquiry, servicecenter_file,  use_yn, user_id, project_id, create_date, modify_date,
                 servicecenter_answer, servicecenter_answer_state, servicecenter_answer_date):

        self.servicecenter_name = servicecenter_name
        self.servicecenter_status = servicecenter_status
        self.servicecenter_inquiry = servicecenter_inquiry
        self.servicecenter_file = servicecenter_file
        self.use_yn = use_yn
        self.user_id = user_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        self.servicecenter_answer = servicecenter_answer
        self.servicecenter_answer_state = servicecenter_answer_state
        self.servicecenter_answer_date = servicecenter_answer_date
        

    @classmethod
    def find_by_id(cls, servicecenter_id):
        return cls.query.filter_by(servicecenter_id=servicecenter_id).first()

    @classmethod
    def find_by_name(cls, servicecenter_name):
        return cls.query.filter_by(servicecenter_name=servicecenter_name).first()

    @classmethod
    def servicecenter_list_project(cls, project_id):
        sql = """ select servicecenter_id, servicecenter_name, servicecenter_status, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date 
                    from tbl_servicecenter where project_id = '"""+project_id+"""' order by create_date desc;"""
        return db.engine.execute(text(sql))

    @classmethod
    def find_by_servicecenter_id(cls, servicecenter_id):
        sql = """ SELECT a.servicecenter_id, a.servicecenter_name, a.servicecenter_inquiry, a.servicecenter_file,
                    a.project_id,date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, a.servicecenter_status, a.servicecenter_answer,date_format(a.servicecenter_answer_date, '%Y-%m-%d %H:%i:%S') servicecenter_answer_date,
                    a.servicecenter_answer_state, b.project_name, b.company_id, c.company_name FROM tbl_servicecenter a
                    left join tbl_project b on a.project_id = b.project_id
                    left join tbl_company c on c.company_id = b.company_id
                    where servicecenter_id = '"""+servicecenter_id+"""';"""

        
        return db.engine.execute(text(sql))

    @classmethod
    def servicecenter_list(cls):
        sql = """SELECT a.servicecenter_id, a.servicecenter_name, a.project_id, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, a.servicecenter_status, a.servicecenter_answer,
                a.servicecenter_answer_state, b.project_name, b.company_id, c.company_name FROM tbl_servicecenter a
                left join tbl_project b on a.project_id = b.project_id
                left join tbl_company c on c.company_id = b.company_id
                order by a.create_date desc;"""
        return db.engine.execute(text(sql))

    @classmethod
    def servicesenter_count(cls):
        # sql="""SELECT replace(FORMAT(SUM(CASE WHEN servicecenter_answer_state is null THEN 1 ELSE 0 END),0), ',' , '') servicecenter_count from tbl_servicecenter"""
        sql="""select count(case when servicecenter_status = '0' then 1 end) servicecenter_count from tbl_servicecenter"""
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()