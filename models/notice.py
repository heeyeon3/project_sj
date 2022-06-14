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
# | notice_id          | integer      | NO   | PRI |         | auto_increment  |
# | notice_title        | varchar(20)  | NO   |     |         |                 |
# | notice_contents     | varchar(50)  | NO   |     |         |                 |
# | use_yn               | varchar(1)   | NO   |     | "Y"     |                 |
# | user_id              | varchar(20)  | NO   |     |         |                 |
# | project_id           | integer      | NO   |     |         | tbl_project     |
# | create_date          | datetime     | NO   |     |         |                 |
# | modify_date          | datetime     | NO   |     |         |                 |
# +----------------------+--------------+------+-----+---------+-----------------+

class NoticeModel(db.Model):
    __tablename__ = 'tbl_notice'

    notice_id =       db.Column(db.Integer, primary_key=True)                                 # 공지사항 아이디
    notice_title =     db.Column(db.String(100), nullable=False)                                # 공지사항 이름
    notice_contents =  db.Column(db.String(), nullable=False)                                # 공지사항 식
    use_yn =            db.Column(db.String(1), nullable=False, default="Y")                    # 공지사항 사용여부
    user_id =           db.Column(db.String(20), nullable=False)                                # 공지사항 등록한 사용자 아이디
    create_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())
    modify_date =       db.Column(db.DateTime, nullable=False, default=datetime.now())

    def __init__(self, notice_title,  notice_contents, use_yn, user_id,  create_date, modify_date):

        self.notice_title = notice_title
        self.notice_contents = notice_contents
        self.use_yn = use_yn
        self.user_id = user_id

        self.create_date = create_date
        self.modify_date = modify_date
        

    @classmethod
    def find_by_id(cls, notice_id):
        return cls.query.filter_by(notice_id=notice_id).first()

    @classmethod
    def find_by_id_time(cls, notice_id):
        sql ="""select notice_id, notice_title, notice_contents, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
                from tbl_notice where notice_id ='"""+notice_id+"""';"""
        return db.engine.execute(text(sql))


    @classmethod
    def find_by_notice_list(cls):
        sql ="""select notice_id, notice_title, notice_contents, date_format(create_date, '%Y-%m-%d %H:%i:%S') create_date
                from tbl_notice order by create_date desc"""
        return db.engine.execute(text(sql))

    # save
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete_to_db(self):
        db.session.delete(self)
        db.session.commit()