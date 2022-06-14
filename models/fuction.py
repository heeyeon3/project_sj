from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+-----------------+
# | Field                | Type         | Null | Key | Default | Extra           |
# +----------------------+--------------+------+-----+---------+-----------------+
# | function_id          | integer      | NO   | PRI |         | auto_increment  |
# | function_name        | varchar(20)  | NO   |     |         |                 |
# | function_formula     | varchar(50)  | NO   |     |         |                 |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class FunctionModel(db.Model):
    __tablename__ = 'tbl_function'

    function_id =       db.Column(db.Integer, primary_key=True)                                 # 변위공식 아이디
    function_name =     db.Column(db.String(20), nullable=False)                                # 변위공식 이름
    function_formula =  db.Column(db.String(200), nullable=False)                                # 변위공식 식
    function_type =     db.Column(db.String(4), nullable=False)                                # 변위공식 식
    use_yn =            db.Column(db.String(1), nullable=False, default="Y")                    # 변위공식 사용여부
    user_id =           db.Column(db.String(20), nullable=False)                                # 변위공식 등록한 사용자 아이디
    project_id =        db.Column(db.Integer, nullable=True)                                   # 변위공식 적용되는 프로젝트 아이디
    company_id =        db.Column(db.Integer, nullable=True)                                   # 변위공식 적용되는 프로젝트 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, function_name,  function_formula, function_type, use_yn, user_id, project_id, company_id, create_date, modify_date):

        self.function_name = function_name
        self.function_formula = function_formula
        self.function_type = function_type
        self.use_yn = use_yn
        self.user_id = user_id
        self.project_id = project_id
        self.company_id = company_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, function_id):
        return cls.query.filter_by(function_id=function_id).first()

    @classmethod
    def find_by_all(cls):
        sql = """select function_id, function_name, function_formula from tbl_function
        where use_yn = 'Y' and project_id = '0' and company_id = '0'
                    order by create_date desc;"""

        
        return db.engine.execute(text(sql))

    @classmethod
    def find_by_project_id(cls, project_id):
        sql = """select function_id, function_name, function_formula from tbl_function
                where use_yn = 'Y' and project_id = '"""+project_id+"""'
                    order by create_date desc;"""

        
        return db.engine.execute(text(sql))


    @classmethod
    def find_by_roadcell(cls, project_id):
        print("find_by_roadcell!!")
        sql = """select function_id, function_name, function_formula from tbl_function
                where use_yn = 'Y' and project_id = '"""+project_id+"""' and function_type = '0204'
                    order by create_date desc;"""

        
        return db.engine.execute(text(sql))

    @classmethod
    def select_roadcell(cls, function_id):
        sql = """select function_id, function_name, function_formula from tbl_function
                where use_yn = 'Y' and function_id = '"""+function_id+"""' and function_type = '0204'
                    order by create_date desc;"""

        return db.engine.execute(text(sql))


    @classmethod
    def select_company_fomula(cls, company_id):
        sql = """select function_id, function_name, function_formula from tbl_function
                where use_yn = 'Y' and company_id = '"""+company_id+"""' and function_type = '0001'
                    order by create_date desc;"""

        return db.engine.execute(text(sql))
 


    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()