from datetime import datetime
from core.db import db
from models.code import CodeModel
from sqlalchemy.sql.expression import true
from sqlalchemy.sql import text
from flask_login import current_user

# +----------------------+--------------+------+-----+---------+----------------+
# | Field                | Type         | Null | Key | Default | Extra          |
# +----------------------+--------------+------+-----+---------+----------------+
# | extention_id         | integer      | NO   | PRI |         | auto_increment |
# | extention_cost       | integer      | NO   |     |         |                |
# | extention_memo       | integer      | NO   |     |         |                |
# | extention_st_dt      | varchar(50)  | NO   |     |         |                |
# | extention_ed_dt      | varchar(50)  | NO   |     |         |                |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                |
# | user_id              | varchar(20)  | NO   |     |         |                |
# | project_id           | integer      | NO   |     |         |                |
# | create_date          | datetime     | NO   |     |         |                |
# | modify_date          | datetime     | NO   |     |         |                |
# +----------------------+--------------+------+-----+---------+----------------+

class ExtentionModel(db.Model):
    __tablename__ = 'tbl_extention'

    extention_id =       db.Column(db.Integer, primary_key=True)                                # 연장 아이디
    extention_cost =     db.Column(db.String(50), nullable=False)                            # 연장 가격
    extention_memo =     db.Column(db.String(50), nullable=False)                            # 연장 메모
    extention_st_dt =    db.Column(db.DateTime, nullable=False)                            # 연장 시작 날짜
    extention_ed_dt =    db.Column(db.DateTime, nullable=False)                                 # 연장 끝 날짜
    use_yn =             db.Column(db.String(1), nullable=False, default="Y")                  # 사용등록 여부
    user_id =            db.Column(db.String(20), nullable=False)                               # 연장 등록한 사용자 아이디
    project_id =         db.Column(db.Integer, nullable=False)                                  # 프로젝트 아이디
    create_date =        db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =        db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, extention_cost, extention_memo, extention_st_dt, extention_ed_dt, use_yn, user_id, project_id, create_date, modify_date):

        self.extention_cost = extention_cost
        self.extention_memo = extention_memo
        self.extention_st_dt = extention_st_dt
        self.extention_ed_dt = extention_ed_dt
        self.use_yn = use_yn
        self.user_id = user_id
        self.project_id = project_id
        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, extention_id):
        return cls.query.filter_by(extention_id=extention_id).first()

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()