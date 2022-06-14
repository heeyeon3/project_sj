from datetime import datetime

from sqlalchemy import sql
from core.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from models.code import CodeModel
from sqlalchemy.sql import text
from flask_login import current_user

# +--------------------+--------------+------+-----+---------+-------+
# | Field              | Type         | Null | Key | Default | Extra |
# +--------------------+--------------+------+-----+---------+-------+
# | user_id            | varchar(20)  | NO   | PRI |         |       |
# | user_pwd           | varchar(128) | NO   |     |         |       |
# | user_nm            | varchar(20)  | NO   |     |         |       |
# | user_grade         | varchar(4)   | NO   |     |         |       |
# | user_conn_date     | datetime     | NO   |     | NULL    |       |
# | use_yn             | varchar(1)   | NO   |     | "Y"     |       |
# | company_id         | Integer      | NO   |     |         |       |
# | project_id         | int          | NO   |     |         |       |
# | create_date        | datetime     | NO   |     |         |       |
# | modify_date        | datetime     | NO   |     |         |       |
# +--------------------+--------------+------+-----+---------+-------+

class UserModel(db.Model):
    __tablename__ = 'tbl_user'

    user_id = db.Column(db.String(20), primary_key=True)                                # 사용자 아이디
    user_pwd = db.Column(db.String(128), nullable=False)                                # 사용자 패스워드(hash 양방향 암호)
    user_nm = db.Column(db.String(20), nullable=False)                                  # 사용자명
    user_grade = db.Column(db.String(4), nullable=False)                                # 사용자 등급(TBL_COMMON)
    user_conn_date = db.Column(db.DateTime, nullable=False, default=datetime.now())     # 사용자 로그인한 시간(90일 미접속 시 휴면계정 전환 체크)
    use_yn = db.Column(db.String(1), nullable=False, default="Y")                       # 사용자 활성화/비활성화(default:Y)
    company_id = db.Column(db.Integer, nullable=False)                                  # 소속 고객사 아이디
    project_id = db.Column(db.Integer, nullable=False)                                  # 소속 프로젝트 아이디
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date = db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, user_id, user_pwd, user_nm, user_grade, user_conn_date, use_yn, company_id, project_id, create_date, modify_date):

        self.user_id = user_id
        # self.set_password(user_pwd)
        self.user_pwd = user_pwd
        self.user_nm = user_nm
        self.user_grade = user_grade
        self.user_conn_date = user_conn_date
        self.use_yn = use_yn
        self.company_id = company_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    def set_password(self, password):
        self.user_pwd = generate_password_hash(password)

    def set_dor_acc(self):
        self.user_dor_acc = "N"
        self.user_conn_date = None

    def check_id_pwd(self, user_id):
        return check_password_hash(self.user_pwd, user_id)

    def check_password(self, password):
        return check_password_hash(self.user_pwd, password)

    def check_password_no_encryption(cls, user_id):
        # sql="""select user_id, use_pwd from tbl_user where user_id = '"""+user_id+"""';"""
        return cls.query.filter_by(user_id=user_id).first()

    def check_time(self):
        sql = """
          select DATEDIFF( NOW(), user_conn_date ) AS DiffDo
        from tbl_user
        """
        sql += "where user_id = '" + self.user_id + "'"

        return db.engine.execute(text(sql))


    @classmethod
    def get_password(cls, user_id, user_nm, user_dept_nm):
        sql = """
            select user_pwd 
            from tbl_user
            where user_nm = :user_nm and user_dept_nm = :user_dept_nm and user_id = :user_id
        """
        return db.engine.execute(text(sql), {'user_nm':user_nm, 'user_dept_nm':user_dept_nm, 'user_id':user_id})

    @classmethod
    def find_by_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def get_user_grade(cls, user_id):
        sql = """
            select user_grade
            from tbl_user
            where user_id = :user_id
        """
        return db.engine.execute(text(sql), {'user_id' :user_id})

    @classmethod
    def get_create_user_id(cls, user_id):
        sql = """
            select create_user_id
            from tbl_user
            where user_id = :user_id
        """
        return db.engine.execute(text(sql), {'user_id' :user_id})


    @classmethod
    def find_all_user_count(cls, params):
        user_id, user_nm, user_grade, group_id = params

        sql = """
            select count(*) tot_cnt
            from tbl_user a
            where a.user_grade != '0100'
            """

        if user_id:
            sql += "and a.user_id like '%" + user_id + "%'"
        elif user_nm:
            sql += " and a.user_nm like '%" + user_nm + "%'"
        elif user_grade:
            sql += " and a.user_grade like '%" + user_grade + "%'"
        elif group_id:
            sql += " and a.group_id = '" + group_id + "'"
        
        if current_user.user_grade != '0101':
            sql += " and (a.user_id = '"+current_user.user_id+"')"

        return db.engine.execute(text(sql))

    @classmethod
    def find_all_user(cls, params):
        user_id, user_nm, user_grade, start, length = params

        sql = """
             select row_number() OVER(order by a.user_grade, a.user_id) row_cnt,
                    a.user_id, a.user_nm, case when a.use_yn = 'Y' then '사용' else '미사용' end use_yn, a.user_pwd, a.user_office, a.user_dept_nm, a.user_dept_charge, 
                    a.user_point, a.user_phone, a.user_birth, a.user_grade, a.user_dept_nm, a.user_dor_acc,
                    to_char(a.create_date, 'YYYY-MM-DD') create_date,
                    to_char(a.user_conn_date, 'YYYY-MM-DD') user_conn_date, to_char(a.user_pwd_change_dt, 'YYYY-MM-DD') user_pwd_change_dt
             from tbl_user a
             where a.user_grade != '0100'
        """
        if user_id:
            sql += "and a.user_id like '%"+user_id+"%'"
        elif user_nm:
            sql += " and a.user_nm like '%"+user_nm+"%'"
        elif user_grade:
            sql += " and a.user_grade like '%"+user_grade+"%'"

        if current_user.user_grade == "0103":
            sql += " and a.user_id = '"+current_user.user_id+"' "

        if current_user.user_grade == "0102":
            sql += " and (a.user_id = '"+current_user.user_id+"')"

        if int(length) > 0:
            sql += " order by a.user_grade, a.user_id limit " + str(length) + " offset " + str(start)

        return db.engine.execute(text(sql))

    def is_active(self):
        return True

    def get_id(self):
        return self.user_id

    def is_authenticated(self):
        return self.user_auth

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_user_code(cls, user_grade):

        return db.session.query(cls.user_id, cls.user_nm, CodeModel.comm_nm)\
                         .join(CodeModel, cls.user_grade == CodeModel.comm_cd) \
                         .filter(cls.user_grade.in_(user_grade))\
                         .filter(CodeModel.comm_up_cd == '0100').all()


    @classmethod
    def find_by_project_id(cls, project_id):
        sql = """select user_id, user_pwd from tbl_user where project_id ='"""+project_id+"';"

        return db.engine.execute(text(sql))


    # @classmethod
    # def find_by_id_msnagement(cls, project_id):
    #     sql = """select user_id, user_grade from tbl_user where project_id ='"""+project_id+"';"

    #     return db.engine.execute(text(sql))

    # @classmethod
    # def find_by_id_monitoring(cls, project_id):
    #     sql = """select user_id from tbl_user where project_id ='"""+project_id+"';"

    #     return db.engine.execute(text(sql))