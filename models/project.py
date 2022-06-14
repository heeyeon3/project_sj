from datetime import datetime

from sqlalchemy import sql
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user



# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | project_id           | integer      | NO   | PRI |         | auto_increment |
# | project_name         | varchar(100)  | NO   |     |         |                |
# | project_set_id       | varchar(100)  | NO   |     |         |                |
# | project_st_dt        | datetime     | NO   |     |         |                |
# | project_ed_dt        | datetime     | NO   |     |         |                |
# | project_cost         | varchar(20)  | NO   |     |         |                |
# | project_memo         | varchar(1000) | NO   |     |         |                |
# | project_status       | varchar(4)   | NO   |     |         | tbl_common     |
# | project_address      | varchar(200)  |      |     |         |                |
# | project_lat          | varchar(10)  |      |     |         |                |
# | project_lng          | varchar(10)  |      |     |         |                |
# | project_img          | varchar(100) |      |     |         |                |
# | project_fp_img       | varchar(100) |      |     |         |                |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | NO   |     |         |                |
# | company_id           | Integer      | NO   |     |         | tbl_company    |
# | project_total_cost   | varchar(200) | NO   |     |         | tbl_company    |
# | project_last_date    | datetime     | NO   |     |         | tbl_company    |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class ProjectModel(db.Model):
    __tablename__ = 'tbl_project'

    project_id =            db.Column(db.Integer, primary_key=True)                                    # 프로젝트 아이디
    project_name =          db.Column(db.String(100), nullable=False)                                  # 프로젝트 명
    project_set_id =        db.Column(db.String(100), nullable=False)                                  # 프로젝트 set id
    project_st_dt =         db.Column(db.DateTime, nullable=False)                                     # 프로젝트 시작날짜
    project_ed_dt =         db.Column(db.DateTime, nullable=False)                                     # 프로젝트 끝 날짜
    project_cost =          db.Column(db.String(20), nullable=False)                                   # 프로젝트 계약금액
    project_memo =          db.Column(db.String(1000), nullable=True)                                  # 프로젝트 메모
    project_status =        db.Column(db.String(4), nullable=False)                                    # 프로젝트 상태
    project_address =       db.Column(db.String(200), nullable=True)                                   # 프로젝트 주소
    project_lat =           db.Column(db.String(10), nullable=True)                                    # 프로젝트 위도
    project_lng =           db.Column(db.String(10), nullable=True)                                    # 프로젝트 경도
    project_img =           db.Column(db.String(200), nullable=True)                                   # 프로젝트 배경 이미지
    project_fp_img =        db.Column(db.String(200), nullable=True)                                   # 프로젝트 현장 도면
    project_weather_nx =    db.Column(db.String(10), nullable=True)  
    project_weather_ny =    db.Column(db.String(10), nullable=True)  

    use_yn =          db.Column(db.String(1), nullable=False, default="Y")                       # 사용 유무
    user_id =         db.Column(db.String(20), nullable=False)                                   # 등록 사용자 아이디
    company_id =      db.Column(db.Integer, nullable=False)                                      # 등록 회사 아이디
    # project_total_cost =      db.Column(db.String(200), nullable=False)                                      # 프로젝트 토탈 금액
    # project_last_date =      db.Column(db.DateTime, nullable=False)                                      # 마지막 계약닐찌
    create_date =     db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =     db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, project_name, project_set_id, project_st_dt, project_ed_dt, project_cost, project_memo, project_status, project_address, project_lat, project_lng, project_img, project_fp_img, 
                project_weather_nx, project_weather_ny, use_yn, user_id, company_id,create_date, modify_date):

        self.project_name = project_name
        self.project_set_id = project_set_id
        self.project_st_dt = project_st_dt
        self.project_ed_dt = project_ed_dt
        self.project_cost = project_cost
        self.project_memo = project_memo
        self.project_status = project_status
        self.project_address = project_address
        self.project_lat = project_lat
        self.project_lng = project_lng
        self.project_img = project_img
        self.project_fp_img = project_fp_img
        self.project_weather_nx = project_weather_nx
        self.project_weather_ny = project_weather_ny
        self.use_yn = use_yn
        self.user_id = user_id
        self.company_id = company_id
        # self.project_total_cost = project_total_cost
        # self.project_last_date = project_last_date
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, project_id):
        return cls.query.filter_by(project_id=project_id).first()

    @classmethod
    def find_by_id_ws(cls, project_id):

        
        sql = """
                select a.project_id, project_name, project_status, project_fp_img, project_set_id, date_format(project_st_dt, '%Y-%m-%d') project_st_dt,  date_format(project_ed_dt, '%Y-%m-%d') project_ed_dt, c.extention_id, c.extention_cost,
                    project_cost, project_address, project_lat, project_lng, project_img, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date,
                    date_format(c.extention_st_dt, '%Y-%m-%d') extention_st_dt, b.company_img,
                    date_format(c.extention_ed_dt, '%Y-%m-%d') extention_ed_dt, b.company_name from tbl_project a 
                    left join tbl_company b on a.company_id = b.company_id
                    left join tbl_extention c on a.project_id = c.project_id
                    where a.project_id = '"""+project_id+"""'
                    order by c.extention_ed_dt desc"""

        return db.engine.execute(text(sql))

    @classmethod
    def find_by_set_id(cls, project_set_id):
        return cls.query.filter_by(project_set_id=project_set_id).first()

    @classmethod
    def find_by_company_id(cls, company_id):
        # sql = """select project_id, project_name, date_format(project_st_dt, '%Y-%m-%d') project_st_dt, date_format(project_ed_dt, '%Y-%m-%d') project_ed_dt, project_cost, project_memo, project_status, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
        # from tbl_project where use_yn = 'Y' and company_id = '"""+company_id+"""';"""

        if company_id == '0':
#             sql = """
# select c.project_id, c.project_name, date_format(c.project_st_dt, '%Y-%m-%d  %H:%i:%S') project_st_dt, date_format(c.project_ed_dt, '%Y-%m-%d') project_ed_dt, c.project_cost, c.project_memo, c.project_status,c.company_id, date_format(c.create_date, '%Y-%m-%d %H:%i:%S') create_date,
#                     c.extention_id, c.extention_cost, c.extention_memo, date_format(c.extention_st_dt, '%Y-%m-%d') extention_st_dt, date_format(c.extention_ed_dt, '%Y-%m-%d') extention_ed_dt, date_format(c.extention_create_date, '%Y-%m-%d %H:%i:%S') extention_create_date, d.company_name, d.company_set_id,
#                     date_format(d.create_date, '%Y-%m-%d %H:%i:%S') project_create_date from
# (select a.project_id, a.project_name,  a.project_st_dt, a.project_ed_dt, a.project_cost, a.project_memo, a.project_status,a.company_id, a.create_date create_date,
#                     b.extention_id, b.extention_cost, b.extention_memo, b.extention_st_dt, b.extention_ed_dt, b.create_date extention_create_date from tbl_project a 
#                     left join tbl_extention b on a.project_id = b.project_id
#                     ) c left join tbl_company d on c.company_id = d.company_id order by project_create_date,c.create_date, extention_ed_dt desc"""
            sql = """select a.company_id, a.company_name, a.company_set_id, b.project_id, date_format(b.create_date, '%Y.%m.%d %H:%i:%S') project_create_date ,
                    b.project_name, date_format(b.project_st_dt, '%Y.%m.%d %H:%i:%S') project_st_dt, date_format(b.project_ed_dt, '%Y.%m.%d %H:%i:%S') project_ed_dt, b.project_cost, b.project_memo, b.project_status,
                    c.extention_id, c.extention_cost, c.extention_memo, date_format(c.extention_st_dt, '%Y.%m.%d %H:%i:%S') extention_st_dt, date_format(c.extention_ed_dt, '%Y.%m.%d %H:%i:%S') extention_ed_dt, date_format(c.create_date, '%Y.%m.%d %H:%i:%S') extention_create_date
                    from tbl_company a
                    left join tbl_project b on a.company_id = b.company_id
                    left join tbl_extention c on b.project_id = c.project_id
                    order by a.company_id desc, b.project_ed_dt desc, c.extention_ed_dt desc"""
            

        else:

            sql = """select a.project_id, a.project_name, a.project_set_id, date_format(a.project_st_dt, '%Y.%m.%d %H:%i:%S') project_st_dt, date_format(a.project_ed_dt, '%Y.%m.%d %H:%i:%S') project_ed_dt, a.project_cost, a.project_memo, a.project_status,a.company_id, date_format(a.create_date, '%Y.%m.%d %H:%i:%S') create_date,
                    b.extention_id, b.extention_cost, b.extention_memo, date_format(b.extention_st_dt, '%Y.%m.%d %H:%i:%S') extention_st_dt, date_format(b.extention_ed_dt, '%Y.%m.%d %H:%i:%S') extention_ed_dt, date_format(b.create_date, '%Y.%m.%d %H:%i:%S') extention_create_date from tbl_project a 
                    left join tbl_extention b on a.project_id = b.project_id
                    where a.company_id = '"""+company_id+"""' and a.use_yn='Y' order by create_date desc, extention_create_date"""

        # 
        return db.engine.execute(text(sql))

    @classmethod
    def find_by_company_id_ws(cls, company_id, project_id):
        print(company_id, type(company_id))
        if company_id == 0:

            sql = """select a.project_id, a.project_img, a.project_name, a.project_set_id, date_format(a.project_st_dt, '%Y-%m-%d') project_st_dt, date_format(a.project_ed_dt, '%Y-%m-%d') project_ed_dt, 
                    a.project_cost, a.project_memo, a.project_status, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, b.company_img, c.extention_id,b.company_name,
                    date_format(c.extention_ed_dt, '%Y-%m-%d') extention_ed_dt
                    from tbl_project a left join tbl_company b on a.company_id=b.company_id
                    left join tbl_extention c on a.project_id = c.project_id 
                    order by a.project_st_dt desc, c.extention_ed_dt desc;"""
        elif company_id != 0 and company_id is not None:
            company_id = str(company_id)
            sql = """select a.project_id, a.project_img, a.project_name, a.project_set_id, date_format(a.project_st_dt, '%Y-%m-%d') project_st_dt, date_format(a.project_ed_dt, '%Y-%m-%d') project_ed_dt, 
                    a.project_cost, a.project_memo, a.project_status, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, b.company_img, c.extention_id, b.company_name,
                    date_format(c.extention_ed_dt, '%Y-%m-%d') extention_ed_dt
                    from tbl_project a left join tbl_company b on a.company_id=b.company_id
                    left join tbl_extention c on a.project_id = c.project_id 
                    where a.use_yn = 'Y' and a.company_id = '"""+company_id+"""'
                    order by a.project_st_dt desc, c.extention_ed_dt desc ;"""

        elif company_id is None:
            project_id = str(project_id)
            sql = """select a.project_id, a.project_img, a.project_name, a.project_set_id, date_format(a.project_st_dt, '%Y-%m-%d') project_st_dt, date_format(a.project_ed_dt, '%Y-%m-%d') project_ed_dt, 
                    a.project_cost, a.project_memo, a.project_status, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, b.company_img, c.extention_id, b.company_name,
                    date_format(c.extention_ed_dt, '%Y-%m-%d') extention_ed_dt
                    from tbl_project a left join tbl_company b on a.company_id=b.company_id
                    left join tbl_extention c on a.project_id = c.project_id 
                    where a.use_yn = 'Y' and a.project_id = '"""+project_id+"""'
                    order by a.project_st_dt desc, c.extention_ed_dt desc ;"""

        # 
        return db.engine.execute(text(sql))

    @classmethod
    def project_company_list(cls):
        

        sql = """
                select project_id, project_name, project_set_id, date_format(project_st_dt, '%Y-%m-%d') project_st_dt, date_format(project_ed_dt, '%Y-%m-%d') project_ed_dt, project_cost, project_memo, project_status, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date,
                b.company_name
                from tbl_project a left join tbl_company b on a.company_id = b.company_id;"""
        

        
        return db.engine.execute(text(sql))

    @classmethod
    def project_end(cls, project_id):

        sql="""select date_format(a.project_ed_dt, '%Y-%m-%d %H:%i:%S') project_ed_dt, date_format(a.project_ed_dt, '%Y-%m-%d %H:%i:%S') project_ed_dt, a.project_id, b.extention_id , 
                date_format(b.extention_ed_dt, '%Y-%m-%d %H:%i:%S') extention_ed_dt
                from tbl_project a
                left join tbl_extention b on a.project_id = b.project_id
                where a.project_id = '"""+project_id+"""'
                order by extention_ed_dt desc
                limit 1"""

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