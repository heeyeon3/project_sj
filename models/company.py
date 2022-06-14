from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | company_id           | integer      | NO   | PRI |         | auto_increment |
# | company_setid        | varchar(20)  | NO   |     |         |                |
# | company_name         | varchar(100)  | NO   |     |         |                |
# | company_ceo          | varchar(10)  | NO   |     |         |                |
# | company_regnum       | varchar(20)  |      |     |         |                |
# | company_worktype     | varchar(20)  |      |     |         |                |
# | company_workcate     | varchar(20)  |      |     |         |                |
# | company_email        | varchar(50)  |      |     |         |                |
# | company_number       | varchar(20)  |      |     |         |                |
# | company_faxnum       | varchar(20)  |      |     |         |                |
# | company_address      | varchar(50)  |      |     |         |                |
# | company_picname      | varchar(10)  |      |     |         |                |
# | company_picnum       | varchar(20)  |      |     |         |                |
# | company_picemail     | varchar(50)  |      |     |         |                |
# | company_img          | varchar(100) | NO   |     |         |                |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | NO   |     |         |                |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class CompanyModel(db.Model):
    __tablename__ = 'tbl_company'

    company_id =       db.Column(db.Integer, primary_key=True)                          # 고객사 ID
    company_set_id =   db.Column(db.String(20), nullable=False)                         # 고객사 설정 ID  bo-03-2 고객사 id
    company_name =     db.Column(db.String(100), nullable=False)                         # 고객사 상호                              
    company_ceo =      db.Column(db.String(50), nullable=False)                         # 고객사 대표자        
    company_regnum =   db.Column(db.String(20), nullable=True)                          # 고객사 사업자등록번호         
    company_worktype = db.Column(db.String(20), nullable=True)                          # 고객사 업태
    company_workcate = db.Column(db.String(20), nullable=True)                          # 고객사 종목 
    company_email =    db.Column(db.String(50), nullable=True)                          # 고객사 수신 이메일             
    company_number =   db.Column(db.String(20), nullable=True)                          # 고객사 대표번호              
    company_faxnum =   db.Column(db.String(20), nullable=True)                          # 고객사 팩스번호           
    company_address =  db.Column(db.String(50), nullable=True)                          # 고객사 주소             
    company_picname =  db.Column(db.String(10), nullable=True)                          # 고객사 담당자 이름                
    company_picnum =   db.Column(db.String(20), nullable=True)                          # 고객사 담당자 연락처 
    company_picemail = db.Column(db.String(50), nullable=True)                          # 고객사 담당자 이메일
    company_img =      db.Column(db.String(200), nullable=True)                        # 고객사 배경 이미지   
    use_yn =           db.Column(db.String(1), nullable=False, default="Y")             # 고객사 사용 여부                   
    user_id =          db.Column(db.String(20), nullable=False)                         # 고객사를 등록한 사용자 아이디
    create_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =      db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, company_set_id, company_name, company_ceo, company_regnum, company_worktype, company_workcate, company_email, company_number, company_faxnum, company_address, company_picname, company_picnum, company_picemail, company_img, use_yn, user_id, create_date, modify_date):

        self.company_set_id = company_set_id
        self.company_name = company_name
        self.company_ceo = company_ceo
        self.company_regnum = company_regnum
        self.company_worktype = company_worktype
        self.company_workcate = company_workcate
        self.company_email = company_email
        self.company_number = company_number
        self.company_faxnum = company_faxnum
        self.company_address = company_address
        self.company_picname = company_picname
        self.company_picnum = company_picnum
        self.company_picemail = company_picemail
        self.company_img = company_img
        self.use_yn = use_yn
        self.user_id = user_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, company_id):
        return cls.query.filter_by(company_id=company_id, use_yn='Y').first()

    @classmethod
    def find_by_project_id(cls, project_id):
        return cls.query.filter_by(project_id=project_id, use_yn='Y').first()

    @classmethod
    def find_by_company_set_id(cls, company_set_id):
        return cls.query.filter_by(company_set_id=company_set_id, use_yn='Y').first()

    @classmethod
    def company_list(cls):
        sql = """select row_number() over(order by create_date desc) rownum, company_set_id, company_name, company_id, company_regnum, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date from tbl_company
                    where use_yn = 'Y' order by company_id"""

        return db.engine.execute(text(sql))
        
    @classmethod
    def company_project(cls):
        sql = """select company_id, count(case when project_status = 'N' then 1 end) N, count(case when project_status = 'W' then 1 end) W, count(case when project_status = 'C' then 1 end) C from tbl_project
                    group by company_id"""

        return db.engine.execute(text(sql))

    @classmethod
    def find_by_company_id(cls, company_id):
        # sql = """select company_id, company_set_id, company_name, company_ceo, company_regnum, company_worktype, company_workcate, company_email, company_number, company_faxnum,
        #          company_address, company_picname, company_picnum, company_picemail, company_img, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date from tbl_company
        #         where use_yn = 'Y' and company_id = '"""+company_id+"""'"""


        sql = """select a.company_id, company_set_id, company_name, company_ceo, company_regnum, company_worktype, company_workcate, company_email, 
                company_number, company_faxnum, company_address, company_picname, company_picnum, company_picemail, company_img, date_format(a.create_date, '%Y-%m-%d %H:%i:%S') create_date, b.user_id, b.user_pwd
                from tbl_company a left join tbl_user b on a.company_id = b.company_id
                where a.company_id = '"""+company_id+"""' and b.user_grade = '0102';"""

        return db.engine.execute(text(sql))

    
    
    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()



    @classmethod
    def find_company_by_user_id(cls, user_id, user_grade):

        sql = """select company_id, company_name from tbl_company """

        if user_grade != '0101' :
            sql += """ where company_id = (select company_id from tbl_user where user_id='"""+user_id+"""')"""

        return db.engine.execute(text(sql))